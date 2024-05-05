from ..models import users_collection
from pymongo.errors import PyMongoError

# Add user data to db, search by email/username
def add_user_data(user_data):
  try:
    # Insert new user's data or update existing user's data by overwritting fields in user_data
    result = users_collection.update_one({"email": user_data["email"]}, {"$set": user_data}, upsert=True)
    if result.upserted_id:
      print("User data inserted with id:", result.upserted_id)
    else:
      print("User data updated")
  except PyMongoError as e:
    print("Error while adding user data:", e)

# Get all the user's data from db, search by email/username
def get_user_data(email):
  try:
    user_data = users_collection.find_one({"email": email})
    return user_data
  except PyMongoError as e:
    print("Error while getting user data:", e)
    return None
  
# Get ratings data from user
def get_ratings_data(email):
    try:
        user_data = users_collection.find_one({"email": email}, {"_id": 0, "ratings": 1})
        # Return the "ratings" field, or an empty dictionary if not found
        return user_data.get("ratings", {}) 
    except PyMongoError as e:
        print("Error while getting ratings data:", e)
        return {}

# Remove a user's data
def remove_user_data(email):
  try:
    result = users_collection.delete_one({"email": email})
    if result.deleted_count == 1:
        print("User data removed successfully")
    else:
        print("User not found")
  except PyMongoError as e:
    print("Error while removing user data:", e)