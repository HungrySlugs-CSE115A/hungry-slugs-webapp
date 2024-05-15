from django.db import models
from db_connection import db

# Create your models here.

# Locations Model
locations_collection = db["locations"]

# Foods Model
foods_collection = db["foods"]

# Users Model
users_collection = db["users"]

# Tasks Model
tasks_collection = db["tasks"]

# User Model
users_collection = db["users"]
