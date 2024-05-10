from django.db import models
from db_connection import db
from django.contrib.auth.models import User
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)

# locations Model
locations_collection = db["locations"]

# Food Model
foods_collection = db["food"]

# Users Model
users_collection = db["users"]

# Tasks Model
tasks_collection = db["tasks"]


# # NOTE: This is temporary and will be replaced with a background task
# from webscraper.food_locations import FoodLocations

# # Fetch dining halls
# fo = FoodLocations()
# # Get dining halls as a list of json objects
# dining_halls: list[dict] = [dh.to_dict() for dh in fo.get_locations()]
# # Add dining halls to db
# from .db_functions.dining_halls import remove_add_dining_halls_to_db

# remove_add_dining_halls_to_db(dining_halls)
