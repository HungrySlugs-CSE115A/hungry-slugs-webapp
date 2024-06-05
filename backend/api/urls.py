from django.urls import path
from . import views
from .model_logic.foods import views as foods_views

urlpatterns = [
    path("locations/", views.get_locations, name="locations"),
    path("users", views.validate_user, name="users"),
    path("logout/", views.current_logout, name="current_logout"),
    path("foods/<str:name>/", foods_views.get_food, name="foods"),
    path("comments/", foods_views.add_comment, name="comments"),
    path("rating_update/", foods_views.user_rating_update, name="rating_update"),
    path("get_ratings_bulk/", foods_views.return_ratings_bulk, name="get_ratings_bulk"),
    # Add the new endpoint for image uploads
    path("upload_image/", views.upload_image, name="upload_image"),
]
