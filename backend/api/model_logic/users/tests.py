from os import name
from django.test import TestCase
from .actions import *


class UsersModelTestCase(TestCase):
    def test_set_get_user(self):
        user_id = "12345"
        name = "test_set_get_user"
        # delete user from db if exists
        delete_user(user_id)

        # set user
        set_user(name, user_id)

        # get user
        user = get_user(user_id)

        # check user
        if user is None:
            self.fail("Failed to set or get user")

        self.assertEquals(user["name"], name)

        # delete the user from db
        delete_user(user_id)

    def test_update_user(self):
        user_id = "12345"
        name = "test_update_user"
        # delete user from db if exists
        delete_user(user_id)

        # set user
        set_user(name, user_id)

        # check user
        user = get_user(user_id)
        if user is None:
            self.fail("Failed to set user")

        # update user
        new_name = "new_name"
        update_user(user_id, new_name)

        # get user
        user = get_user(user_id)

        # check user
        if user is None:
            self.fail("Failed to update user")

        self.assertEquals(user["name"], new_name)

        # delete the user from db
        delete_user(user_id)

    def test_delete_user(self):
        user_id = "12345"
        name = "test_delete_user"
        # delete user from db if exists
        delete_user(user_id)

        # set user
        set_user(name, user_id)

        # check user
        user = get_user(user_id)
        if user is None:
            self.fail("Failed to set user")

        # delete user
        delete_user(user_id)

        # check user
        user = get_user(user_id)
        self.assertIsNone(user)
