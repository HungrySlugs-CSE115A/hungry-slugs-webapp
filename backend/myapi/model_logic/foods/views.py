from rest_framework.decorators import api_view
from rest_framework.response import Response

from .actions import (
    get_food as get_food_db,
    set_food as set_food_db,
    update_food as update_food_db,
)
from urllib.parse import unquote

from ..locations.actions import get_locations, find_food_in_location


# Get request that takes parameter of food name and returns the food object
# if it doesn't exist in the db it will add the food object to the db
@api_view(["GET"])
def get_food(request, name: str):
    # decode the food name
    name = unquote(name)

    # get the locations from the db
    locations = get_locations()

    # get the location representation of the food
    location_food = None
    for location in locations:
        location_food = find_food_in_location(location, name)
        if location_food is not None:
            break

    # set restrictions to the location representation of the food restrictions
    if location_food and "restrictions" in location_food:
        restrictions = location_food["restrictions"]
    else:
        restrictions = []

    # get the food from the db
    food = get_food_db(name=name)

    if food:
        # check if the restrictions are different
        if food["restrictions"] != restrictions:
            # update the food object in the db
            food = update_food_db(name=name, restrictions=restrictions)

    # if the food doesn't exist in the db
    if food is None:
        # add the food object to the db
        food = set_food_db(name=name, restrictions=restrictions)

    # check if the food is None
    if food is None:
        # return a 404 response
        return Response(status=404)

    # remove the _id field from the food object
    if "_id" in food:
        food.pop("_id")

    return Response(food)


## Comments
@api_view(["POST"])
def add_comment(request):
    # get the food name from the request
    name = request.data.get("food_name")
    # get the user id from the request
    user_id = request.data.get("user_id")
    # get the comment from the request
    comment = request.data.get("comment")

    # check if the food name, user id, and comment are not None
    if name is None or user_id is None or comment is None:
        # return a 400 response Bad Request
        return Response(status=400)

    # decode the food name
    name = unquote(name)

    # get the food from the db
    food = get_food_db(name=name)

    # check if the food is None
    if food is None:
        # return a 404 response
        return Response(status=404)

    # update the food object in the db
    food = update_food_db(name=name, user_id=user_id, comment=comment)

    # check if the food is None
    if food is None:
        # return a 404 response
        return Response(status=404)

    # remove the _id field from the food object
    if "_id" in food:
        food.pop("_id")

    return Response(food)
