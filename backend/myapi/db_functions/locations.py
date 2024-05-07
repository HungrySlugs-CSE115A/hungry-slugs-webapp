from ..models import locations_collection


def remove_locations_from_db(names: list[str]) -> None:
    for name in names:
        locations_collection.delete_many({"name": name})


def add_locations_to_db(locations: list[dict]) -> None:
    for dh in locations:
        locations_collection.insert_one(dh)


def get_names_of_locations(locations: list[dict]) -> list[str]:
    names = []
    for dh in locations:
        names.append(dh["name"])
    return names


def remove_add_locations_to_db(locations: list[dict]) -> None:
    # get names of locations
    names = get_names_of_locations(locations)
    # remove locations with the names
    remove_locations_from_db(names)
    # add locations to db
    add_locations_to_db(locations)


def get_all_locations_from_db() -> list[dict]:
    return list(locations_collection.find({}))
