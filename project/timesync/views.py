from django.shortcuts import render
from .models import User, Calendar, Event
from .serializers import UserSerializer, CalendarSerializer, EventSerializer
from rest_framework import viewsets

# Create your views here.


def index(request):
    return render(request, 'timesync/index.html')


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CalendarView(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer


class EventView(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
