from django.urls import path
from . import views
from .model_logic.foods import views as foods_views
from .model_logic.users import actions as user_funcs

urlpatterns = [
    path("locations/", views.get_locations, name="locations"),
    path("db_update/", foods_views.bulk_update_db, name="db_update"),
    path("users", views.validate_user, name="users"),
    path("logout/", views.current_logout, name="current_logout"),
    path("foods/<str:name>/", foods_views.get_food, name="foods"),
    path("comments/", foods_views.add_comment, name="comments"),
    path("rating_update/", foods_views.user_rating_update, name = "rating_update"),
    path("get_ratings/", foods_views.get_ratings, name = "get_ratings")
]
