from rest_framework.response import Response
from rest_framework.decorators import api_view

from .webscraper.food_options import FoodOptions

from .db_functions.dining_halls import get_all_dining_halls_from_db

# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


# Get the list of dining halls
@api_view(["GET"])
def get_dining_halls(request):
    # Get all dining halls from the db
    dining_halls : list[dict] = get_all_dining_halls_from_db()

    # remove the _id field from each dining hall
    for dh in dining_halls:
        dh.pop("_id")

    # Convert the list of dining halls to json
    json_data = {"dining_halls": dining_halls}

    return Response(json_data)
