from django.db import models
from django.contrib.auth.models import User


class Calendar(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, related_name="calendar", on_delete=models.CASCADE)


class Event(models.Model):
    id = models.AutoField(primary_key=True)
    calendar = models.ForeignKey(Calendar, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    location = models.CharField(
        max_length=250, null=True, blank=True, default="")
    start = models.DateTimeField()
    end = models.DateTimeField()
    description = models.TextField(
        max_length=500, null=True, blank=True, default="")
