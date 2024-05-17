from django.urls import path
from . import views
from .model_logic.foods import views as foods_views

urlpatterns = [
    path("locations/", views.get_locations, name="locations"),
    path("foods/<str:name>/", foods_views.get_food, name="foods"),
]
