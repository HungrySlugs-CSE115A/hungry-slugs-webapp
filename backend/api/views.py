import json
from .model_logic.foods.actions import get_food, set_food, update_food
from django.http import JsonResponse


from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from django.http import JsonResponse


from .model_logic.locations.actions import (
    get_locations as get_locations_db,
    update_locations,
)
from .model_logic.tasks.actions import (
    get_last_update_time,
    update_task,
    set_task,
    update_task,
)
from utils import str_to_datetime, get_date

from .model_logic.locations.actions import (
    update_locations,
    get_locations as get_locations_db,
)

from webscraper.food_locations import FoodLocations


from datetime import datetime

GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


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
        time_now: datetime = get_date()

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

        # create a set of all foods from the locations
        all_foods: dict[str, list[str]] = {}
        for dh in locations:
            for category in dh["categories"]:
                for sub_category in category["sub_categories"]:
                    for food in sub_category["foods"]:
                        if "restrictions" not in food:
                            continue
                        if not isinstance(food["restrictions"], list):
                            continue

                        all_foods[food["name"]] = food["restrictions"]

        # check if if each food exists in the db
        for food in all_foods:
            # check if name is in the food
            if "name" not in food:
                continue
            food_name = food[0]

            # check if the food_name is a string
            if not isinstance(food_name, str):
                continue

            # get the restrictions from the food
            restrictions = []
            if "restrictions" in food:
                restrictions: list[str] = all_foods[food_name]

            # get the food from the db
            food_db = get_food(name=food_name)

            # check if the food exists in the db
            if food_db is None:
                # add the food to the db
                set_food(name=food_name, restrictions=restrictions)
            else:
                # check if the restrictions are the same
                if food_db["restrictions"] != restrictions:
                    # update the restrictions
                    update_food(name=food_name, restrictions=restrictions)

        # Update the locations in the db
        update_locations(locations)

        # update the last update time
        update_task(task_name="locations")

        # get all locations from the db
        locations: list[dict] = get_locations_db()

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

    # import json

    # # convert the json data to a string
    # json_data = json.dumps(json_data)

    return JsonResponse(json_data)


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
        # current_user = CurrentUser(request.session)
        # request.session["current_user"] = user_info["email"]

    except requests.RequestException as e:
        return JsonResponse({"error": "Failed to validate access token"}, status=500)

    return JsonResponse({"message": "User is validated", "user_info": user_info})


@api_view(["POST"])
def current_logout(request):
    current_user = CurrentUser(request.session)
    current_user.logout()

    print("Current session after logout:", request.session.get("current_user"))
    return JsonResponse({"message": "User has been logged out"})


@api_view(["POST"])
def upload_image(request):
    if request.method == "POST" and request.FILES.get("image"):
        # Handle image upload logic here
        uploaded_image = request.FILES["image"]
        # Process the uploaded image (e.g., save it to a storage location)
        # Return a JSON response indicating success
        return JsonResponse({"success": True, "message": "Image uploaded successfully"})
    else:
        # Return a JSON response with an error message if no image is provided or method is not POST
        return JsonResponse({"success": False, "message": "Image upload failed"})


# @api_view(["GET"])
# def get_user_rating(request):
#     user = get_rating(request.user_ids)
#     if(user==None):
#         return Response({"message": "No user found"})
#     else:
#         return Response({"message": "User found: {user}", "user data": user})
