from django.db import models
from db_connection import db
from django.contrib.auth.models import User
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
# Dining Hall Model
dining_hall_collection = db["dining_hall"]


# NOTE: This is temporary and will be replaced with a background task
from .webscraper.food_options import FoodOptions
# Fetch dining halls
fo = FoodOptions()
# Get dining halls as a list of json objects
dining_halls: list[dict] = fo.jsonify_dining_halls()
# Add dining halls to db
from .db_functions.dining_halls import remove_add_dining_halls_to_db
remove_add_dining_halls_to_db(dining_halls)

