from ..models import dining_hall_collection



def remove_dining_halls_from_db(names: list[str]) -> None:
    for name in names:
        dining_hall_collection.delete_many({"name": name})

def add_dining_halls_to_db(dining_halls: list[dict]) -> None:
    for dh in dining_halls:
        dining_hall_collection.insert_one(dh)

def get_names_of_dining_halls(dining_halls: list[dict]) -> list[str]:
    names = []
    for dh in dining_halls:
        names.append(dh["name"])
    return names

def remove_add_dining_halls_to_db(dining_halls: list[dict]) -> None:
    # get names of dining halls
    names = get_names_of_dining_halls(dining_halls)
    # filter out dining halls without meals or meals without foods
    dining_halls = [dh for dh in dining_halls if len(dh["meals"]) > 0]
    dining_halls = [dh for dh in dining_halls if len(dh["meals"].keys()[0]) > 0]
    # remove dining halls with the names
    remove_dining_halls_from_db(names)
    # add dining halls to db
    add_dining_halls_to_db(dining_halls)

def get_all_dining_halls_from_db() -> list[dict]:
    return list(dining_hall_collection.find({}))
