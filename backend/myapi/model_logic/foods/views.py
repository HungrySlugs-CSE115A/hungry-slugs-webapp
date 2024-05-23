from rest_framework.decorators import api_view
from rest_framework.response import Response

from .actions import (
    get_food as get_food_db,
    set_food as set_food_db,
    update_food as update_food_db,
)
from urllib.parse import unquote

from ..locations.actions import get_locations, find_food_in_location
from ..users.actions import update_user


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



##bulk food get?
@api_view(["POST"])
def bulk_update_db(request):
    name = request.data.get("dh_name")

    # get the location from the db
    location = get_locations([name])[0]
    if "categories" not in location:
        print(f"-"*20 +" Cat")
        return Response(status=400)
    for category in location["categories"]: 
        if "sub_categories" not in category:
            continue
        for subcategory in category["sub_categories"]:
            if "foods" not in subcategory:
                continue
            for food in subcategory["foods"]:
                if "name" not in food:
                    continue
                db_food = get_food_db(food['name'])
                if db_food != None: #check if the food name is in the dh dict

                    if(db_food["restrictions"] != food["restrictions"]): #udpate the restrinctions if not the same
                        update_food_db(food["name"], food["restrictions"])
                    continue
                else:
                    #add food to db
                    set_food_db(food["name"], food["restrictions"])

    return Response(200)

## Ratings
# update_user

# @api_view(["POST"])
# def get_ratings(request):
    
#     # get the food name from the request
#     food_name = request.data.get("food_item")
#     print("-"*20 + food_name + "-"*20)
#     food = get_food_db( food_name)
#     if(food ==None):
#         return Response (404)

#     rating = food['allergies']
#     print(rating)

#     return Response(200)
from ...models import foods_collection

@api_view(["GET"])
def get_ratings(request):

    foods = {}
    for n in foods_collection.find():
        if(n == None) :return Response(404)
        foods[n['name']] = n['ratings']

    return Response(foods)

@api_view(["POST"])
def user_rating_update(request):
    # get the food name from the request
    food_name = request.data.get("food_name")
    # get the user id from the request
    user_id = request.data.get("user_id")

    food_rating = request.data.get("food_rating")
    if(food_rating == None ):
        print("none?")
    print("Food: "+ food_name)
    print("User: "+ user_id)
    print(f"", end = "")
    print({food_rating})

    if(get_food_db(food_name) == None): #a bit redundant, no?
        print("Food: "+ food_name)
        return Response(status =  404 )
    
    if(update_food_db(food_name, [], user_id, food_rating) == None):
        print("No user")
        return Response(status =  404 )
    
    if(update_user(user_id, food_name, food_rating) == None):
        return Response(status =  404 )
    
    return Response(food_rating)


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
