from django.urls import path
from . import views

urlpatterns = [
    path("locations/", views.get_locations, name="locations"),
    path("foods/<str:food_name>/", views.get_food, name="foods"),
]
