from rest_framework import serializers
from .models import Calendar, Event, Friendship
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email',
                  'password', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], validated_data['email'], validated_data['password'],
                                        first_name=validated_data['first_name'], last_name=validated_data['last_name'])
        calendar = Calendar.objects.create(
            user=user, username=validated_data['username'])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Credentials")


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('__all__')


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('id', 'user', 'events')

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['events'] = EventSerializer(instance.events, many=True).data
        return response


class FriendshipSerializer(serializers.ModelSerializer):
    calendar = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ('__all__')

    def get_calendar(self, instance):
        user = instance.creator if self.context.get(
            'user') == instance.friend.username else instance.friend
        return CalendarSerializer(Calendar.objects.filter(user=user), many=True).data[0]


class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email',
                  'first_name', 'last_name', 'calendar', 'friends')

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['calendar'] = CalendarSerializer(
            instance.calendar, many=True).data[0]
        return response

    def get_friends(self, instance):
        friendships = Friendship.objects.filter(
            Q(creator=instance.id) | Q(friend=instance.id))
        return FriendshipSerializer(friendships, many=True, context={'user': instance.id}).data
