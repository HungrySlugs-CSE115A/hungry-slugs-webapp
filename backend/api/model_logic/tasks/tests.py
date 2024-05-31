from django.test import TestCase
from .actions import *

from utils import str_to_datetime


class TasksTestCase(TestCase):
    def test_set_get_task(self):
        task_name = "test_set_get_task"

        # delete task from db if exists
        delete_task(task_name)

        # set task
        task = set_task(task_name)

        # check task
        if task is None:
            self.fail("Failed to set task")

        # get task
        task = get_task(task_name)

        # check task
        if task is None:
            self.fail("Failed to get task")

        # delete the task from db
        delete_task(task_name)

    def test_update_task(self):
        task_name = "test_update_task"

        # delete task from db if exists
        delete_task(task_name)

        # set task
        task = set_task(task_name)

        time_before = task["last_update"]

        # check task
        if task is None:
            self.fail("Failed to set task")

        # update task
        update_task(task_name)

        # get task
        task = get_task(task_name)

        # check task
        if task is None:
            self.fail("Failed to update task")

        time_after = task["last_update"]

        # compare times
        time_before = str_to_datetime(time_before)
        time_after = str_to_datetime(time_after)

        # check if the time has been updated
        self.assertTrue(time_after > time_before)

        # delete the task from db
        delete_task(task_name)

    def test_delete_task(self):
        task_name = "test_delete_task"

        # delete task from db if exists
        delete_task(task_name)

        # set task
        task = set_task(task_name)

        # check task
        if task is None:
            self.fail("Failed to set task")

        # delete task
        delete_task(task_name)

        # get task
        task = get_task(task_name)

        # check task
        self.assertIsNone(task)
