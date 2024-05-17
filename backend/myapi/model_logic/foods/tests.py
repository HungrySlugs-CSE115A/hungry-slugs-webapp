from django.test import TestCase

# create tests for the foods model
from myapi.model_logic.foods.actions import *


class FoodsTestCase(TestCase):
    def test_set_get_food(self):
        food_name = "rice_test_set_get"
        # delete food from db if exists
        delete_food(food_name)
        # set food
        food = set_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to set food")
        self.assertEquals(food["name"], food_name)
        self.assertEquals(food["restrictions"], [])
        self.assertEquals(food["ratings"], {})
        self.assertEquals(food["comments"], {})
        self.assertEquals(food["images"], {})

        # delete food from db if exists
        delete_food(food_name)

    def test_update_food(self):
        food_name = "rice_test_update"
        # set food
        food = set_food(food_name)
        if food is None:
            self.fail("Failed to set food")
        # update food
        user_id = "12345"
        rating = 5
        update_food(food_name, user_id=user_id, rating=rating)
        # get food
        food = get_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to update food")
        if type(food["ratings"]) is not dict:
            self.fail("Ratings is not a dict")
        self.assertEquals(food["ratings"][user_id], rating)

        # delete food from db if exists
        delete_food(food_name)

    def test_delete_food(self):
        food_name = "rice_test_delete"
        # set food
        food = set_food(food_name)
        if food is None:
            self.fail("Failed to set food")
        # delete food
        delete_food(food_name)
        # get food
        food = get_food(food_name)
        # check food
        self.assertIsNone(food)
