from pymongo import MongoClient
from private.private_settings import (
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_CLUSTER,
    IS_DEV,
)


def get_db_handle(db_name: str, password: str, username: str, cluster: str):

    client = MongoClient(f"mongodb+srv://{username}:{password}@{cluster}")
    db_handle = client[db_name]
    return db_handle, client


def get_local_db_handle(db_name: str, host: str = "localhost", port: int = 27017):
    client = MongoClient(host, port)
    db_handle = client[db_name]
    return db_handle, client


if __name__ == "__main__":
    if IS_DEV and False:
        # Remove the False to test locally but you will have to have a local mongodb server running
        db_handle, client = get_local_db_handle("test")
    else:
        db_handle, client = get_db_handle(
            "test", MONGODB_PASSWORD, MONGODB_USERNAME, MONGODB_CLUSTER
        )

    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    # create a collection
    test_collection = db_handle["test_collection"]
    print("Created a collection called test_collection")
    print("Collections in the database: ", db_handle.list_collection_names())

    # create a dining hall
    dh1 = {
        "name": "Porter",
        "location": "Porter College",
        "hours": "7:30am - 8:00pm",
        "menu": {
            "breakfast": ["eggs", "bacon", "cereal"],
            "lunch": ["pizza", "salad", "sandwiches"],
            "dinner": ["pasta", "soup", "chicken"],
        },
    }

    # insert the dining hall into the collection
    test_collection.insert_one(dh1)

    # find the dining hall
    query = {"name": "Porter"}
    result = test_collection.find_one(query)
    print("Found the following dining hall:")
    print(result)
