from ..models import foods_collection


"""
food_name: str,
ratings: {
    username: int
}
"""

## Basic CRUD


def set_food(name: str) -> dict | None:
    # check if food already exists
    food = foods_collection.find_one({"food_name": name})
    if food:
        return
    # add food
    food = {"food_name": name, "ratings": {}}
    foods_collection.insert_one(food)
    return food


def get_food(name: str) -> dict | None:
    return foods_collection.find_one({"food_name": name})


def update_food(food_name: str, username: str, rating: int | None = None) -> None:
    # check if food exists
    food = foods_collection.find_one({"food_name": food_name})
    if not food:
        return

    if rating is not None:
        # add/change rating
        food["ratings"][username] = rating
        # update food
        foods_collection.update_one(
            {"food_name": food_name}, {"$set": {"ratings": food["ratings"]}}
        )


def delete_food(name: str) -> None:
    foods_collection.delete_one({"food_name": name})
