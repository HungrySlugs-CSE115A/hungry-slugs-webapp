from ..models import locations_collection


def remove_dining_halls_from_db(names: list[str]) -> None:
    for name in names:
        locations_collection.delete_many({"name": name})


def add_dining_halls_to_db(dining_halls: list[dict]) -> None:
    for dh in dining_halls:
        locations_collection.insert_one(dh)


def get_names_of_dining_halls(dining_halls: list[dict]) -> list[str]:
    names = []
    for dh in dining_halls:
        names.append(dh["name"])
    return names


def remove_add_dining_halls_to_db(dining_halls: list[dict]) -> None:
    # get names of dining halls
    names = get_names_of_dining_halls(dining_halls)
    # remove dining halls with the names
    remove_dining_halls_from_db(names)
    # add dining halls to db
    add_dining_halls_to_db(dining_halls)


def get_all_dining_halls_from_db() -> list[dict]:
    return list(locations_collection.find({}))
