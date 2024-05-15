from dns import update
from requests import get
from rest_framework.response import Response
from rest_framework.decorators import api_view

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
