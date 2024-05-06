from ..models import foods_collection


def add_food(name: str) -> None:
    foods_collection.insert_one({"name": name, "ratings": []})


def remove_food(food_name: str) -> None:
    foods_collection.delete_one({"name": food_name})


# NOTE: you might want to add more to seach for the type of food
def overwrite_food_rating(food_name: str, user_name: str, rating: int) -> None:
    # make sure rating is between 0 and 5
    if rating < 0:
        rating = 0
    elif rating > 5:
        rating = 5

    # get the food
    food: dict[str, str | int | list[dict[str, str | int]]] | None = (
        foods_collection.find_one({"name": food_name})
    )

    # if the food does not exist, add it
    if food is None:
        add_food(food_name)
        food: dict[str, str | int | list[dict[str, str | int]]] | None = (
            foods_collection.find_one({"name": food_name})
        )

    # check if the food is none
    if food is None:
        return

    # check if the user has already rated the food
    ratings: list[dict[str, str | int]] = food["ratings"]
    for rate in ratings:
        if rate["user"] == user_name:
            rate["rating"] = rating
            return

    # add new rating to the food for the user
    ratings.append({"user": user_name, "rating": rating})


# NOTE: you might want to add more to seach for the type of food
def get_food_ratings(food_name: str) -> list[dict[str, str | int]]:
    # get the food
    food: dict[str, str | int | list[dict[str, str | int]]] | None = (
        foods_collection.find_one({"name": food_name})
    )

    # if the food does not exist, return an empty list
    if food is None:
        return []

    return food["ratings"]


def get_average_rating(food_name: str) -> float:
    # get the food
    ratings = get_food_ratings(food_name)
    if len(ratings) == 0:
        return 0

    # calculate the average rating
    total = 0
    for rate in ratings:
        num: int = int(rate["rating"])
        total += num

    return total / len(ratings)


def remove_all_ratings(food_name: str) -> None:
    # get the food
    food: dict[str, str | int | list[dict[str, str | int]]] | None = (
        foods_collection.find_one({"name": food_name})
    )

    # if the food does not exist, return
    if food is None:
        return

    # remove all ratings
    food["ratings"] = []

    # update the food
    foods_collection.update_one({"name": food_name}, {"$set": {"ratings": []}})


# NOTE: there can be more functions to search for the type of food
