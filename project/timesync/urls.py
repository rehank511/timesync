from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserView)
router.register(r'calendars', views.CalendarView)
router.register(r'events', views.EventView)

urlpatterns = [
    path('', views.index),
    path(r'api/', include(router.urls))
]
