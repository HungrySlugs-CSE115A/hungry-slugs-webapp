from dns import update
from requests import get
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
import requests

from .db_functions.locations import update_locations, get_locations as get_locations_db
from .db_functions.tasks import (
    update_task,
    get_last_update_time,
    set_task,
    str_to_datetime,
)
from webscraper.food_locations import FoodLocations


from django.utils import timezone
from datetime import datetime

GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


# Get the list of locations at UCSC and their information
@api_view(["GET"])
def get_locations(request):
    # Get the last update time of the locations
    last_update: datetime | None = get_last_update_time(task_name="locations")

    # check if the last update time doesn't exist
    if last_update is None:
        task = set_task(task_name="locations")
        time_now = str_to_datetime(task["last_update"])
    else:
        # get the current time and make it naive
        time_now: datetime = timezone.now().replace(tzinfo=None)

    print("Last time   : ", last_update)
    print("Current time: ", time_now)

    # check if not updated in the last hour
    if last_update is None or (time_now - last_update).seconds > 3600:
        print("Locations need to be updated...")

        # fetch the locations from the web scraper and add them to the db
        fo = FoodLocations()

        # Filter out the empty locations
        filtered_locations = fo.get_non_empty_locations()

        # Convert the list of dining halls to a list of dictionaries
        locations = [dh.to_dict() for dh in filtered_locations]

        # Update the locations in the db
        update_locations(locations)

        # update the last update time
        update_task(task_name="locations", last_update=time_now)

    else:
        print("Locations are up to date. Getting from DB...")
        # Get all locations from the db
        locations: list[dict] = get_locations_db()

    # remove the _id field from each dining hall
    for dh in locations:
        if "_id" in dh:
            dh.pop("_id")

    # Convert the list of dining halls to json
    json_data = {"locations": locations}

    return Response(json_data)


class CurrentUser:
    def __init__(self, session):
        self.session = session

    @property
    def is_authenticated(self):
        return "current_user" in self.session

    @property
    def info(self):
        return self.session.get("current_user")

    def logout(self):
        if "current_user" in self.session:
            del self.session["current_user"]


@api_view(["POST"])
def validate_user(request):
    token_response = request.data.get("tokenResponse")
    access_token = token_response.get("access_token")
    # using access token to retrieve user information similar to frontend
    try:
        response = requests.get(
            GOOGLE_USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"}
        )
        response.raise_for_status()
        user_info = response.json()

        # add user_info to database using get or create possibly

        # add current user
        current_user = CurrentUser(request.session)
        request.session["current_user"] = user_info["email"]

    except requests.RequestException as e:
        return JsonResponse({"error": "Failed to validate access token"}, status=500)

    return JsonResponse({"message": "User is validated", "user_info": user_info})


@api_view(["POST"])
def current_logout(request):
    current_user = CurrentUser(request.session)
    current_user.logout()

    print("Current session after logout:", request.session.get("current_user"))
    return JsonResponse({"message": "User has been logged out"})
