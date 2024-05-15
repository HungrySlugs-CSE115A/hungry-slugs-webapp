from requests import get
from ..models import tasks_collection
from datetime import datetime

# import time from django
from django.utils import timezone

"""
name: str
last_update: str
"""

## Basic CRUD


def set_task(task_name: str) -> dict[str, str]:
    """
    Create a new task with the given name
    """
    # get the time from django and make it naive
    time_now: datetime = timezone.now().replace(tzinfo=None)

    # convert the time to a string
    time_str = time_now.strftime("%Y-%m-%d %H:%M:%S")

    # create a new task
    task = {"name": task_name, "last_update": time_str}

    # insert the task into the tasks collection
    tasks_collection.insert_one(task)

    return task


def get_task(task_name: str) -> dict | None:
    """
    Get the task from the database
    """
    return tasks_collection.find_one({"name": task_name})


def update_task(task_name: str, last_update: datetime) -> None:
    """
    Update the task in the database
    """
    # convert the time to a string
    time_str = last_update.strftime("%Y-%m-%d %H:%M:%S")

    # update the task
    tasks_collection.update_one(
        {"name": task_name}, {"$set": {"last_update": time_str}}
    )


def delete_task(task_name: str) -> None:
    """
    Delete the task from the database
    """
    tasks_collection.delete_one({"name": task_name})


## Additional CRUD


def get_last_update_time(task_name: str) -> datetime | None:
    """
    Get the last update time of the task from the database
    """
    # find the task in the tasks collection
    task = get_task(task_name)

    # check if the location exists
    if task is None:
        return None

    # get the last update time
    last_update = task["last_update"]

    # convert the string to a datetime object
    last_update_time = datetime.strptime(last_update, "%Y-%m-%d %H:%M:%S")

    return last_update_time


## helper functions


def str_to_datetime(time_str: str) -> datetime:
    """
    Convert a string to a datetime object
    """
    return datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")