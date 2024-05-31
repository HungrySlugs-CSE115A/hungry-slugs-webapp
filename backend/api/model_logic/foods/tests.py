from django.test import TestCase

# create tests for the foods model
from .actions import *


class FoodsTestCase(TestCase):
    def test_set_get_food(self):
        food_name = "Chicken & Rice test_set_get_food"
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
        self.assertEquals(food["comments"], [])
        self.assertEquals(food["images"], [])

        # delete food from db if exists
        delete_food(food_name)

    def test_update_food(self):
        food_name = "rice_test_update"
        # delete food from db if exists
        delete_food(food_name)
        # set food
        food = set_food(food_name)
        if food is None:
            self.fail("Failed to set food")
        # update food
        user_id = "12345"
        # ratings
        rating = 5
        update_food(food_name, user_id=user_id, rating=rating)
        # get food
        food = get_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to update food")
        if type(food["ratings"]) is not dict:
            self.fail("Ratings is not a dict")
        self.assertTrue(user_id in food["ratings"])
        self.assertEquals(food["ratings"][user_id]["rating"], rating)
        # update rating
        rating = 4
        update_food(food_name, user_id=user_id, rating=rating)
        # get food
        food = get_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to update food")
        if type(food["ratings"]) is not dict:
            self.fail("Ratings is not a dict")
        self.assertTrue(user_id in food["ratings"])
        self.assertEquals(food["ratings"][user_id]["rating"], rating)

        # comments
        comment = "This is a comment"
        update_food(food_name, user_id=user_id, comment=comment)
        # get food
        food = get_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to update food")
        if type(food["comments"]) is not list:
            self.fail("Comments is not a list")
        self.assertEquals(food["comments"][0]["comment"], comment)

        # images
        image_url = "http://www.example.com/image.jpg"
        update_food(food_name, user_id=user_id, image_url=image_url)
        # get food
        food = get_food(food_name)
        # check food
        if food is None:
            self.fail("Failed to update food")
        if type(food["images"]) is not list:
            self.fail("Images is not a list")
        self.assertEquals(food["images"][0]["url"], image_url)

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
