from django.urls import path, re_path
from . import views

urlpatterns = [
    path("hello-world/", views.hello_world, name="hello_world"),
    path("locations/", views.get_locations, name="locations"),
    #path('users/', views.create_user, name='create_user'),
    path('users/<str:backend>/', views.create_user, name='create_user'),
    #path('getuser/', views.get_user, name='get_user'),
]
