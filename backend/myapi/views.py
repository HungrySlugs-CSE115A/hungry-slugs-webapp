from django.conf.locale import fr
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .db_functions.locations import (
    get_all_locations_from_db,
    remove_add_locations_to_db,
)
from .db_functions.tasks import set_task_last_update, get_task_last_update
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
    last_update: datetime | None = get_task_last_update(task_name="locations")

    # get the current time and make it naive
    time_now: datetime = timezone.now()
    time_now = time_now.replace(tzinfo=None)

    print("Last time   : ", last_update)
    print("Current time: ", time_now)

    # check if not updated in the last hour
    if last_update is None or (time_now - last_update).seconds > 3600:
        print("Locations need to be updated...")
        # fetch the locations from the web scraper and add them to the db
        fo = FoodLocations()
        locations: list[dict] = [dh.to_dict() for dh in fo.get_locations()]
        # add the locations to the db
        remove_add_locations_to_db(locations)

        # update the last update time
        set_task_last_update(task_name="locations")

    else:
        print("Locations are up to date. Getting from DB...")
        # Get all locations from the db
        locations: list[dict] = get_all_locations_from_db()

    # remove the _id field from each dining hall
    for dh in locations:
        if "_id" in dh:
            dh.pop("_id")

    # Convert the list of dining halls to json
    json_data = {"locations": locations}

    return Response(json_data)
