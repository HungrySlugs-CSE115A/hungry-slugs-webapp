from ...models import users_collection

## Basic CRUD


def set_user(username: str, id: str) -> None:
    # check if user already exists
    user = users_collection.find_one({"username": username})
    if user:
        return
    # add user
    users_collection.insert_one({"name": username, "user_id": id})


def get_user(id: str) -> dict | None:
    return users_collection.find_one({"user_id": id})


def update_user(id: str, name: str | None = None) -> None:
    # check if user exists
    user = users_collection.find_one({"user_id": id})
    if not user:
        return

    if name is not None:
        users_collection.update_one({"user_id": id}, {"$set": {"name": name}})


def delete_user(id: str) -> None:
    users_collection.delete_one({"user_id": id})
