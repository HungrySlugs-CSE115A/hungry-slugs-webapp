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
    path("user_rating_get/", user_funcs.get_user, name = "user_rating_get"),
    path("user_rating_update/", user_funcs.update_user, name = "user_update_rating")
]
