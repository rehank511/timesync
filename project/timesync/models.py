from django.db import models
from django.core.validators import int_list_validator

# Create your models here.


class User(models.Model):
    user_id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)


class Calendar(models.Model):
    calendar_id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    name = models.CharField(max_length=100)
    events = models.CharField(max_length=100, validators=[int_list_validator])


class Event(models.Model):
    event_id = models.IntegerField(primary_key=True)
    calendar_id = models.IntegerField()
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=250)
    start = models.DateTimeField()
    end = models.DateTimeField()
    description = models.TextField()
