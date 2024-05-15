from django.urls import path
from . import views

urlpatterns = [
    path("hello-world/", views.hello_world, name="hello_world"),
    path("locations/", views.get_locations, name="locations"),
    path("users", views.validate_user, name="users"),
    path("logout/", views.current_logout, name="current_logout"),
]
