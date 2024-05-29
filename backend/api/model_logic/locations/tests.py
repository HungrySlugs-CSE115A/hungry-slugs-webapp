from django.test import TestCase
from .actions import *


class LocationsTestCase(TestCase):
    def test_set_get_location(self):
        location = {
            "name": "test_set_get_location",
            "categories": [
                {
                    "name": "category1",
                    "sub_categories": [
                        {
                            "name": "sub_category1",
                            "foods": [
                                {
                                    "name": "food1",
                                    "restrictions": ["restriction1"],
                                },
                            ],
                        }
                    ],
                }
            ],
        }

        # delete location from db if exists
        delete_location(location["name"])

        # set location
        set_location(location)

        # check location
        location = get_location(location["name"])
        if location is None:
            self.fail("Failed to set or get location")

        # delete the location from db
        delete_location(location["name"])

    def test_update_location(self):
        location = {
            "name": "test_update_location",
            "categories": [
                {
                    "name": "category1",
                    "sub_categories": [
                        {
                            "name": "sub_category1",
                            "foods": [
                                {
                                    "name": "food1",
                                    "restrictions": ["restriction1"],
                                },
                            ],
                        }
                    ],
                }
            ],
        }

        # delete location from db if exists
        delete_location(location["name"])

        # set location
        set_location(location)

        # check location
        location = get_location(location["name"])
        if location is None:
            self.fail("Failed to set or get location")

        # update location
        location["categories"][0]["sub_categories"][0]["foods"][0][
            "restrictions"
        ].append("restriction2")
        update_location(location["name"], location)

        # check location
        location = get_location(location["name"])
        if location is None:
            self.fail("Failed to update location")

        self.assertEquals(
            location["categories"][0]["sub_categories"][0]["foods"][0]["restrictions"],
            ["restriction1", "restriction2"],
        )

        # delete the location from db
        delete_location(location["name"])

    def test_delete_location(self):
        location = {
            "name": "test_delete_location",
            "categories": [
                {
                    "name": "category1",
                    "sub_categories": [
                        {
                            "name": "sub_category1",
                            "foods": [
                                {
                                    "name": "food1",
                                    "restrictions": ["restriction1"],
                                },
                            ],
                        }
                    ],
                }
            ],
        }

        # delete location from db if exists
        delete_location(location["name"])

        # set location
        set_location(location)

        # delete location
        delete_location(location["name"])

        # check location
        location = get_location(location["name"])

        self.assertIsNone(location)
