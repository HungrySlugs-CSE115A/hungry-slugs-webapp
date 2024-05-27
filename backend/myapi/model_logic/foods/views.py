from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .actions import (
    get_food as get_food_db,
    set_food as set_food_db,
    update_food as update_food_db,
)
from urllib.parse import unquote

from ..locations.actions import get_locations, find_food_in_location, get_location


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


## Ratings
@api_view(["POST"])
def return_ratings_bulk(request):
    food_names: list[str] = request.data.get("food_names")
    user_id: str | None = request.data.get("user_id")

    if food_names == None:
        print("food_names is None")
        return Response(404)

    ratings = {}

    for food in food_names:
        rating = {}
        food_db = get_food_db(food)
        if food_db == None:
            set_food_db(food, [])
            food_db = get_food_db(food)
            if food_db == None:
                print("food_db is None")
                return Response(404)
        ratings_db = food_db["ratings"]
        if not isinstance(ratings_db, dict):
            print("ratings_db is not a dict")
            return Response(404)

        for user_id_db, rating_db in ratings_db.items():
            # verify rating_db is dict
            if not isinstance(rating_db, dict):
                print("rating_db is not a dict")
                return Response(404)

            # add rating to the average
            if "rating" not in rating_db:
                print("rating not in rating_db")
                return Response(404)

            # check if the rating is a float
            if not isinstance(rating_db["rating"], float):
                print("rating is not a float")
                return Response(404)

            if "average" not in rating:
                rating["average"] = rating_db["rating"]
            else:
                rating["average"] += rating_db["rating"]

            if user_id and user_id == user_id_db:
                rating["user_rating"] = rating_db["rating"]

        if "user_rating" not in rating:
            rating["user_rating"] = None

        if len(ratings_db) > 0:
            # divide the average by the number of ratings
            rating["average"] = rating["average"] / len(ratings_db)

            # round the average to 1 decimal places
            rating["average"] = round(rating["average"], 1)
        else:
            rating["average"] = None

        # add the rating to the ratings dict
        ratings[food] = rating

    return Response(ratings)


##update ratings


@api_view(["POST"])
def user_rating_update(request):
    # get the food name from the request
    food_name = request.data.get("food_name")
    # get the user id from the request
    user_id = request.data.get("user_id")
    # get the rating from the request
    food_rating = request.data.get("food_rating")
    if food_rating == None:
        print("none?")

    print("Food: " + food_name)
    print("User: " + user_id)
    print(food_rating)

    update_food_db(name=food_name, user_id=user_id, rating=food_rating)

    # get the food from the db
    food = get_food_db(name=food_name)

    # check if the food is None
    if food is None:
        return Response(status=404)

    # add up all the ratings
    average = 0
    ratings = food["ratings"]

    # check if the ratings is a list
    if not isinstance(ratings, dict):
        return Response(status=404)

    for _, rating in ratings.items():
        if not isinstance(rating, dict):
            return Response(status=404)

        if "rating" not in rating:
            return Response(status=404)

        score = rating["rating"]
        # check if the score is a float
        if not isinstance(score, float):
            return Response(status=404)
        average += score

    average = average / len(ratings)

    if average == 0:
        average = None

    return JsonResponse({"average": average})


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
