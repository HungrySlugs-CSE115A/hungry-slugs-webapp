from requests import delete
from ..models import users_collection

"""
username: str,
id: str,
ratings: {
    food_name: int
}
"""

## Basic CRUD


def set_user(username: str, id: str) -> None:
    # check if user already exists
    user = users_collection.find_one({"username": username})
    if user:
        return
    # add user
    users_collection.insert_one({"username": username, "id": id, "ratings": {}})


def get_user(id: str) -> dict | None:
    return users_collection.find_one({"id": id})


def update_user(id: str, food_name: str, rating: int | None = None) -> None:
    # check if user exists
    user = users_collection.find_one({"id": id})
    if not user:
        return

    if rating is not None:
        # add/change rating
        user["ratings"][food_name] = rating
        # update user
        users_collection.update_one({"id": id}, {"$set": {"ratings": user["ratings"]}})


def delete_user(id: str) -> None:
    users_collection.delete_one({"id": id})
