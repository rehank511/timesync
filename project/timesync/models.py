from django.db import models
from django.core.validators import int_list_validator

# Create your models here.


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)


class Calendar(models.Model):
    calendar_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)


class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    calendar_id = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    location = models.CharField(
        max_length=250, null=True, blank=True, default="")
    start = models.DateTimeField()
    end = models.DateTimeField()
    description = models.TextField(
        max_length=500, null=True, blank=True, default="")
