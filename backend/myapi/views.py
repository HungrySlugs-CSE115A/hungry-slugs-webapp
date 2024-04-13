from rest_framework.response import Response
from rest_framework.decorators import api_view

from .webscraper.food_options import FoodOptions


# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


# Get the list of dining halls
@api_view(["GET"])
def get_dining_halls(request):
    fo = FoodOptions()
    json_data = fo.jsonify()

    return Response(json_data)
