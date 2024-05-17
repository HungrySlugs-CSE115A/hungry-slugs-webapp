from ...models import locations_collection

"""
name: str
"""


## Basic CRUD
def set_location(location: dict) -> None:
    locations_collection.insert_one(location)


def get_location(name: str) -> dict | None:
    return locations_collection.find_one({"name": name})


def update_location(name: str, location: dict) -> None:
    """
    check if the location exists then overwrite the location
    """
    # check if the location exists
    if get_location(name) is None:
        set_location(location)  # if not, create a new location

    # overwrite the location
    locations_collection.update_one({"name": name}, {"$set": location})


def delete_location(name: str) -> None:
    locations_collection.delete_one({"name": name})


## Bulk CRUD


def set_locations(locations: list[dict]) -> None:
    locations_collection.insert_many(locations)


def get_locations(names: list[str] = []) -> list[dict]:
    """
    if no names are given, return all locations
    else, return the locations with the given names
    """
    if len(names) == 0:
        return list(locations_collection.find({}))  # get all locations

    return list(
        locations_collection.find({"name": {"$in": names}})
    )  # get specific locations


def update_locations(locations: list[dict]) -> None:
    for location in locations:
        update_location(location["name"], location)


def delete_locations(names: list[str]) -> None:
    locations_collection.delete_many({"name": {"$in": names}})


## Helpers
def find_food_in_location(location: dict, food_name: str) -> dict | None:
    if "categories" not in location:
        return
    for category in location["categories"]:
        if "sub_categories" not in category:
            continue
        for subcategory in category["sub_categories"]:
            if "foods" not in subcategory:
                continue
            for food in subcategory["foods"]:
                if "name" not in food:
                    continue
                if food["name"] == food_name:
                    return food
