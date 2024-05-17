from django.urls import path
from . import views

urlpatterns = [
    path("locations/", views.get_locations, name="locations"),
    path("users", views.validate_user, name="users"),
    path("logout/", views.current_logout, name="current_logout"),
    # path("foods/<str:food_name>/", views.get_food, name="foods"),
]
