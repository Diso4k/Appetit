from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=(
        ('client', 'Клиент'),
        ('cashier', 'Кассир'),
        ('courier', 'Курьер'),
        ('admin', 'Админ'),
    ), default='client')

    def __str__(self):
        return self.user.username
    
class MenuItem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Offer(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    discount_percent = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title