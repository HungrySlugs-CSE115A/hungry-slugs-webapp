from ...models import users_collection

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


def update_user(id: str) -> None:
    # check if user exists
    user = users_collection.find_one({"id": id})
    if not user:
        return


def delete_user(id: str) -> None:
    users_collection.delete_one({"id": id})
