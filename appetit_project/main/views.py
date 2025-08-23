from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile
from .models import MenuItem, Offer


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User  # твоя кастомная модель

@receiver(post_save, sender=User)
def set_default_role(sender, instance, created, **kwargs):
    if created and not instance.role:
        instance.role = "client"
        instance.save()


def index(request):
    role = "guest"
    if request.user.is_authenticated:
        role = request.user.profile.role  

    menu_items = MenuItem.objects.filter(is_available=True)
    offers = Offer.objects.filter(active=True)

    return render(request, "index.html", {
        "role": role,
        "menu_items": menu_items,
        "offers": offers,
    })

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # логинимся по email (ищем username по email)
        username = User.objects.filter(email=email).values_list('username', flat=True).first()
        user = authenticate(request, username=username, password=password) if username else None

        if user:
            login(request, user)
            return redirect('index')
        messages.error(request, 'Неверный email или пароль')
    return redirect('index')

def logout_view(request):
    logout(request)
    return redirect('index')

def register_view(request):
    if request.method == 'POST':
        name = request.POST.get('name') or ''
        phone = request.POST.get('phone') or ''
        email = request.POST.get('email')
        address = request.POST.get('address') or ''
        password = request.POST.get('password')

        if not email or not password:
            messages.error(request, 'Укажите email и пароль')
            return redirect('index')
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email уже зарегистрирован')
            return redirect('index')

        # простой username из email (уникализируем при необходимости)
        base_username = email.split('@')[0]
        username = base_username
        i = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{i}"
            i += 1

        user = User.objects.create_user(username=username, email=email, password=password, first_name=name)
        # профиль создастся сигналом, но обновим поля:
        profile = getattr(user, 'profile', None) or UserProfile.objects.create(user=user)
        profile.phone = phone
        profile.address = address
        profile.role = 'client'
        profile.save()

        login(request, user)
        return redirect('index')
    return redirect('index')