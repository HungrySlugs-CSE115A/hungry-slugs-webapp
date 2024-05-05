from ..models import users_collection

"""
username: str,
ratings: {
    food_name: int
}
"""


def set_new_user(username: str) -> None:
    # check if user already exists
    user = users_collection.find_one({"username": username})
    if user:
        return
    # add user
    users_collection.insert_one({"username": username, "ratings": {}})


def get_user(username: str) -> dict | None:
    return users_collection.find_one({"username": username})

def set_food_rating(username: str, food_name: str, rating: int) -> None:
    # check if user exists
    user = users_collection.find_one({"username": username})
    if not user:
        return
    # add/change rating
    user["ratings"][food_name] = rating
    # update user
    users_collection.update_one(
        {"username": username}, {"$set": {"ratings": user["ratings"]}}

def get_food_rating(username: str, food_name: str) -> int | None:
    # check if user exists
    user = users_collection.find_one({"username": username})
    if not user:
        return None
    # check if food exists
    if food_name not in user["ratings"]:
        return None
    return user["ratings"][food_name]

def get_user_ratings(username: str) -> dict | None:
    # check if user exists
    user = users_collection.find_one({"username": username})
    if not user:
        return None
    return user["ratings"]
    