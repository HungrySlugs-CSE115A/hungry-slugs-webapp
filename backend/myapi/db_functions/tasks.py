from ..models import tasks_collection
from datetime import datetime

# import time from django
from django.utils import timezone

"""
name: str
last_update: str
"""


def set_task_last_update(task_name: str) -> None:
    """
    Set the time that the task were last update the time should be based upon the database time
    """
    # get the time from django
    time_now: datetime = timezone.now()

    # convert the time to a string
    time_str = time_now.strftime("%Y-%m-%d %H:%M:%S")

    # get the task from the tasks collection
    task: dict | None = tasks_collection.find_one({"name": task_name})

    # check if the task exists
    if task is None:
        # create a new task
        task = {"name": task_name, "last_update": time_str}
        # insert the task into the tasks collection
        tasks_collection.insert_one(task)
    else:
        # update the task
        tasks_collection.update_one(
            {"name": task_name}, {"$set": {"last_update": time_str}}
        )


def get_task_last_update(task_name: str) -> datetime | None:
    """
    Get the last update time of the task from the database
    """
    # find the task in the tasks collection
    task: dict | None = tasks_collection.find_one({"name": task_name})

    # check if the location exists
    if task is None:
        return None

    # get the last update time
    last_update = task["last_update"]

    # convert the string to a datetime object
    last_update_time = datetime.strptime(last_update, "%Y-%m-%d %H:%M:%S")

    return last_update_time
