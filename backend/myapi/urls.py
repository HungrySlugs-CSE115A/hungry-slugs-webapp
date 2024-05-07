from django.urls import path
from . import views

urlpatterns = [
    path("hello-world/", views.hello_world, name="hello_world"),
    path("dining-halls/", views.get_dining_halls, name="dining_halls"),
    path('users/', views.create_user, name='create_user'),
]
