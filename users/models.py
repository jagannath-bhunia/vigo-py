from django.db import models
from django.contrib.auth.models import AbstractUser

class User(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    password = models.CharField(max_length=200,blank=True, null=True)
    is_active = models.BooleanField(default=1)
    deleted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name