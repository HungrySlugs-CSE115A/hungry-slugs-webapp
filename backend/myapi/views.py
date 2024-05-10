from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from .webscraper.food_options import FoodOptions
from .db_functions.dining_halls import get_all_dining_halls_from_db
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from social_django.utils import psa
from django.conf.locale import fr
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .db_functions.locations import (
    get_all_locations_from_db,
    remove_add_locations_to_db,
)
from .db_functions.tasks import set_task_last_update, get_task_last_update
from webscraper.food_locations import FoodLocations


from django.utils import timezone
from datetime import datetime


# Create your views here.
@api_view(["GET"])
def hello_world(request):
    return Response({"message": "Hello, world!"})


# Get the list of locations at UCSC and their information
@api_view(["GET"])
def get_locations(request):
    # Get the last update time of the locations
    last_update: datetime | None = get_task_last_update(task_name="locations")

    # get the current time and make it naive
    time_now: datetime = timezone.now()
    time_now = time_now.replace(tzinfo=None)

    print("Last time   : ", last_update)
    print("Current time: ", time_now)

    # check if not updated in the last hour
    if last_update is None or (time_now - last_update).seconds > 3600:
        print("Locations need to be updated...")
        # fetch the locations from the web scraper and add them to the db
        fo = FoodLocations()
        locations: list[dict] = [dh.to_dict() for dh in fo.get_locations()]
        # add the locations to the db
        remove_add_locations_to_db(locations)

        # update the last update time
        set_task_last_update(task_name="locations")

    else:
        print("Locations are up to date. Getting from DB...")
        # Get all locations from the db
        locations: list[dict] = get_all_locations_from_db()

    # remove the _id field from each dining hall
    for dh in locations:
        if "_id" in dh:
            dh.pop("_id")

    # Convert the list of dining halls to json
    json_data = {"locations": locations}

    return Response(json_data)
#user information
@api_view(['POST'])
@permission_classes([AllowAny])
@psa('social:complete')
def create_user(request,backend):
    # Extract the token sent from the frontend
    
    token = request.data.get('access_token')
    print(token)

    # `do_auth` method will try to authenticate the token with Google
    try:
        user = request.backend.do_auth(token)
    except Exception as e:
        # Log the exception to understand why authentication fails
        print(f'Authentication failed: {str(e)}')
        return Response(
            {'errors': {'token': 'Authentication failed', 'detail': str(e)}},
            status=status.HTTP_403_FORBIDDEN,
        )


    if user:
        # If user is authenticated, get or create a token for your application
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'id': user.id,
            'name': user.username,
            'email': user.email,
            'token': token.key  # Send the token key to the frontend
        })
    else:
        return Response(
            {'errors': {'token': 'Invalid token'}},
            status=status.HTTP_400_BAD_REQUEST,
        )