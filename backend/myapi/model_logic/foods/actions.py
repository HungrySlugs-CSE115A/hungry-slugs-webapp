from ...models import foods_collection

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
        "ratings": {},
        "comments": {},
        "images": {},
    }
    foods_collection.insert_one(food)
    return food


def get_food(name: str) -> dict[str, str | float | dict] | None:
    return foods_collection.find_one({"name": name})


def update_food(
    name: str,
    restrictions: list[str] = [],
    user_id: str | None = None,
    rating: int | None = None,
) -> None:
    # check if food exists
    food = foods_collection.find_one({"name": name})
    if not food:
        return

    # update restrictions
    if len(restrictions) > 0:
        foods_collection.update_one(
            {"name": name}, {"$set": {"restrictions": restrictions}}
        )

    # update rating
    if rating is not None and user_id is not None:
        # add/change rating
        food["ratings"][user_id] = rating
        # update food
        foods_collection.update_one(
            {"name": name}, {"$set": {"ratings": food["ratings"]}}
        )


def delete_food(name: str) -> None:
    foods_collection.delete_one({"name": name})
