from django.db import models
from db_connection import db

# Create your models here.

# Locations Model
restrictions_schema = {
    "bsonType": "array",
    "items": {"bsonType": "string"},
}
foods_schema = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "name": {"bsonType": "string"},
            "restrictions": restrictions_schema,
        },
        "required": ["name", "restrictions"],
    },
}
sub_categories_schema = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "foods": foods_schema,
            "name": {"bsonType": "string"},
        },
        "required": ["foods", "name"],
    },
}
categories_schema = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "name": {"bsonType": "string"},
            "sub_categories": sub_categories_schema,
        },
        "required": ["name", "sub_categories"],
    },
}
locations_validator = {
    "$jsonSchema": {
        "title": "location",
        "properties": {
            "_id": {"bsonType": "objectId"},
            "categories": categories_schema,
            "name": {"bsonType": "string"},
        },
        "required": ["_id", "categories", "name"],
    }
}
locations_collection = db["locations"]
db.command(command="collMod", value="locations", validator=locations_validator)

# Foods Model
restrictions_schema = {
    "bsonType": "array",
    "items": {"bsonType": "string"},
}
ratings_schema_location = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "user_id": {"bsonType": "string"},
            "rating": {"bsonType": "double"},
            "date": {"bsonType": "string"},
        },
        "required": ["user_id", "rating", "date"],
    },
}
# comments sorted by date
comments_schema = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "comment": {"bsonType": "string"},
            "user_id": {"bsonType": "string"},
            "date": {"bsonType": "string"},
        },
        "required": ["comment", "user_id", "date"],
    },
}
images_schema = {
    "bsonType": "array",
    "items": {
        "bsonType": "object",
        "properties": {
            "url": {"bsonType": "string"},
            "user_id": {"bsonType": "string"},
            "date": {"bsonType": "string"},
        },
        "required": ["url", "user_id", "date"],
    },
}
foods_validator = {
    "$jsonSchema": {
        "title": "food",
        "properties": {
            "_id": {"bsonType": "objectId"},
            "name": {"bsonType": "string"},
            "price": {"bsonType": "double"},  # not required field
            "restrictions": restrictions_schema,
            "ratings": ratings_schema_location,
            "comments": comments_schema,
            "images": images_schema,
        },
        "required": ["_id", "name", "restrictions", "ratings", "comments", "images"],
    }
}
foods_collection = db["foods"]
db.command(command="collMod", value="foods", validator=foods_validator)

# Users Model
ratings_schema_user = {
    "bsonType": "object",
    "properties": {
        "rating": {"bsonType": "double"},
        "food_name": {"bsonType": "string"},
    },
    "required": ["rating", "food_id"],
}
users_validator = {
    "$jsonSchema": {
        "title": "user",
        "properties": {
            "_id": {"bsonType": "objectId"},
            "name": {"bsonType": "string"},
            "user_id": {"bsonType": "string"},
            "ratings": ratings_schema_user,
        },
        "required": ["_id", "name", "user_id", "ratings"],
    }
}
users_collection = db["users"]
db.command(command="collMod", value="users", validator=users_validator)

# Tasks Model
tasks_validator = {
    "$jsonSchema": {
        "title": "task",
        "properties": {
            "_id": {"bsonType": "objectId"},
            "last_update": {"bsonType": "string"},
            "name": {"bsonType": "string"},
        },
        "required": ["_id", "last_update", "name"],
    }
}
tasks_collection = db["tasks"]
db.command(command="collMod", value="tasks", validator=tasks_validator)
