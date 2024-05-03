from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from .webscraper.food_options import FoodOptions

from .db_functions.dining_halls import get_all_dining_halls_from_db

# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


# Get the list of dining halls
@api_view(["GET"])
def get_dining_halls(request):
    # Get all dining halls from the db
    dining_halls : list[dict] = get_all_dining_halls_from_db()

    # remove the _id field from each dining hall
    for dh in dining_halls:
        dh.pop("_id")

    # Convert the list of dining halls to json
    json_data = {"dining_halls": dining_halls}

    return Response(json_data)

#user information
@api_view(['POST'])
def create_user(request):
    email = request.data.get('email')
    full_name = request.data.get('name', '').split()
    first_name = full_name[0] if full_name else ''
    last_name = ' '.join(full_name[1:]) if len(full_name) > 1 else ''

    try:
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email,  
            'first_name': first_name,
            'last_name': last_name
        })
        if created:
            return Response({'message': 'User created successfully'})
        else:
            return Response({'message': 'User already exists'})
    except IntegrityError:
        return Response({'error': 'This email is already in use.'})
    except Exception as e:
        return Response({'error': str(e)})
