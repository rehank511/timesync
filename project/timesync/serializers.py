from rest_framework import serializers
from .models import User, Calendar, Event


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'username', 'password', 'email')


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('calendar_id', 'user_id', 'name', 'events')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('event_id', 'calendar_id', 'name',
                  'location', 'start', 'end', 'description')
