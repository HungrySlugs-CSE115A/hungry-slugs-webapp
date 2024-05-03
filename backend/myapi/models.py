from django.db import models
from db_connection import db

# Create your models here.

# Dining Hall Model
dining_hall_collection = db["dining_hall"]

# Food Rating Model
foods_collection = db["food_rating"]


# NOTE: This is temporary and will be replaced with a background task
from webscraper.food_locations import FoodLocations

# Fetch dining halls
fo = FoodLocations()
# Get dining halls as a list of json objects
dining_halls: list[dict] = [dh.to_dict() for dh in fo.get_locations()]
# Add dining halls to db
from .db_functions.dining_halls import remove_add_dining_halls_to_db

remove_add_dining_halls_to_db(dining_halls)
