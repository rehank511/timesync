from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.UserListCreate.as_view()),
    path('api/calendar/', views.CalendarListCreate.as_view()),
    path('api/event/', views.EventListCreate.as_view()),
]
