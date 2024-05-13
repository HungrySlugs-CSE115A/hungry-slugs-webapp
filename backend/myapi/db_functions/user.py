from ..models import users_collection

"""
username: str,
id: str,
ratings: {
    food_name: int
}
"""

# user
# rating

def set_user(username: str, id: str) -> None:
    # check if user already exists
    user = users_collection.find_one({"username": username})
    if user:
        return
    # add user
    users_collection.insert_one({"username": username, "id": id, "ratings": {}})


def get_user(id: str) -> dict | None:
    return users_collection.find_one({"id": id})

def get_user_by_username(username: str) -> dict[str, str|dict] | None:
    return users_collection.find_one({"username": username})

def set_food_rating(iL: str, food_name: str, rating: int) -> None:
    # check if user exists
    user = users_collection.find_one({"id": id})
    if not user:
        return
    # add/change rating
    user["ratings"][food_name] = rating
    # update user
    users_collection.update_one(
        {"id": id}, {"$set": {"ratings": user["ratings"]}}
    )

def get_food_rating(id: str, food_name: str) -> int | None:
    # check if user exists
    user = users_collection.find_one({"id": id})
    if not user:
        return None
    # check if user rated
    if food_name not in user["ratings"]:
        return None
    return user["ratings"][food_name]

def get_food_ratings(id: str) -> dict[str, int] | None:
    # check if user exists
    user = users_collection.find_one({"id": id})
    if not user:
        return None
    return user["ratings"]
