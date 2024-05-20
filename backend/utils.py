from pymongo import MongoClient
from private.private_settings import (
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_CLUSTER,
    IS_DEV,
)
from datetime import datetime
from backend.settings import TIME_ZONE
import pytz


def get_db_handle(db_name: str, password: str, username: str, cluster: str):

    client = MongoClient(f"mongodb+srv://{username}:{password}@{cluster}")
    db_handle = client[db_name]
    return db_handle, client


def get_local_db_handle(db_name: str, host: str = "localhost", port: int = 27017):
    client = MongoClient(host, port)
    db_handle = client[db_name]
    return db_handle, client


def get_date() -> datetime:
    return datetime.now(pytz.timezone(TIME_ZONE))


def get_date_str() -> str:
    return get_date().isoformat()


def str_to_datetime(date_str: str) -> datetime:
    # convert isoformat string to datetime
    return datetime.fromisoformat(date_str)
