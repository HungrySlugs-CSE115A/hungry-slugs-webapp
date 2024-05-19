from ...models import foods_collection
from utils import get_date_str

## Basic CRUD


def set_food(
    name: str, restrictions: list[str] = []
) -> dict[str, str | float | dict] | None:
    # check if food already exists
    food = foods_collection.find_one({"name": name})
    if food:
        return
    # add food
    food = {
        "name": name,
        "restrictions": restrictions,
        "ratings": [],
        "comments": [],
        "images": [],
    }
    foods_collection.insert_one(food)
    return food


def get_food(name: str) -> dict[str, str | float | dict] | None:
    return foods_collection.find_one({"name": name})


def update_food(
    name: str,
    restrictions: list[str] = [],
    user_id: str | None = None,
    rating: float | None = None,
    comment: str | None = None,
    image_url: str | None = None,
) -> dict | None:
    # check if food exists
    food: dict | None = foods_collection.find_one({"name": name})
    if not food:
        return

    # get the time of the update
    date: str = get_date_str()

    # update restrictions
    if len(restrictions) > 0:
        foods_collection.update_one(
            {"name": name}, {"$set": {"restrictions": restrictions}}
        )

    # update rating
    if rating is not None and user_id is not None:
        # insure rating is a float
        rating = float(rating)

        # get the current ratings
        ratings = food["ratings"]

        # check if the user has already rated the food
        old_rating_dict: dict | None = foods_collection.find_one(
            {"name": name, "ratings.user_id": user_id}
        )

        # if the user has already rated the food
        if old_rating_dict:
            # update the rating
            foods_collection.update_one(
                {"name": name, "ratings.user_id": user_id},
                {"$set": {"ratings.$.rating": rating}},
            )
        else:
            # add the rating
            ratings.append({"user_id": user_id, "rating": rating, "date": date})

            # update the ratings in the db
            foods_collection.update_one({"name": name}, {"$set": {"ratings": ratings}})

    # update comment
    if comment is not None and user_id is not None:
        # get the current comments
        comments = food["comments"]

        # add the comment
        comments.append({"comment": comment, "user_id": user_id, "date": date})

        # update the comments in the db
        foods_collection.update_one({"name": name}, {"$set": {"comments": comments}})

    # update image
    if image_url is not None and user_id is not None:
        # get the current images
        images = food["images"]

        # add the image
        images.append({"url": image_url, "user_id": user_id, "date": date})

        # update the images in the db
        foods_collection.update_one({"name": name}, {"$set": {"images": images}})

    return food


def delete_food(name: str) -> None:
    foods_collection.delete_one({"name": name})
