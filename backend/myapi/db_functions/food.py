from ..models import foods_collection


"""
food_name: str,
ratings: {
    username: int
}

user_name: str,
ratings: {
    food_name: int
}
"""

def set_food(name: str) -> None:
    # check if food already exists
    food = foods_collection.find_one({"food_name": name})
    if food:
        return
    # add food
    foods_collection.insert_one({"food_name": name, "ratings": {}})


def get_food(name: str) -> dict | None:
    return foods_collection.find_one({"food_name": name})


def set_rating(food_name: str, username: str, rating: int) -> None:
    # check if food exists
    food = foods_collection.find_one({"food_name": food_name})
    if not food:
        return
    # add/change rating
    food["ratings"][username] = rating
    # update food
    foods_collection.update_one(
        {"food_name": food_name}, {"$set": {"ratings": food["ratings"]}}
    )

    # add rating to user's ratings


def get_user_rating(food_name: str, username: str) -> int | None:
    # check if food exists
    food = foods_collection.find_one({"food_name": food_name})
    if not food:
        return None
    # check if user rated
    if username not in food["ratings"]:
        return None
    return food["ratings"][username]

def get_avg_rating(food_name: str) -> float | None:
    # check if food exists
    food = foods_collection.find_one({"food_name": food_name})
    if not food:
        return None
    # calculate average rating
    ratings = food["ratings"].values()
    return sum(ratings) / len(ratings)
