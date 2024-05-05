from ..models import users_collection
from pymongo.errors import PyMongoError

# Add user data to MongoDB
def add_user(user_data):
  try:
    result = users_collection.insert_one(user_data)
    print("User data inserted with id:", result.inserted_id)
  except PyMongoError as e:
    print("Error while adding user data:", e)

# Get user data from MongoDB
def get_user(email):
  try:
    user_data = users_collection.find_one({"email": email})
    return user_data
  except PyMongoError as e:
    print("Error while getting user data:", e)
    return None