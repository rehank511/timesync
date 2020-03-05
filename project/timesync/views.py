from .models import User, Calendar, Event
from .serializers import UserSerializer, CalendarSerializer, EventSerializer
from rest_framework import generics

# Create your views here.


class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CalendarListCreate(generics.ListCreateAPIView):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer


class EventListCreate(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
