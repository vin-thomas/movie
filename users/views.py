from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm
from django.contrib.auth.models import User
from django.contrib import messages
from pytz import timezone
from datetime import datetime


# Create your views here.
def login_view(request):
    if request.user.is_authenticated:
        return redirect('app:index')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if not User.objects.filter(username=username).exists():
            # Display an error message if the username does not exist
            messages.error(request, 'Invalid Username')
            return render(request, 'users/login.html', {'message': "Invalid Username"})
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            with open("../logs/login.log", "a+", encoding="utf-8") as log:
                log.seek(0)
                if len(log.read()) != 0:
                    log.write("\n" + str(datetime.now(timezone("Asia/Kolkata")).strftime('%Y-%m-%d %H:%M:%S.%f')) + "   " + username)
                else:
                    log.write(str(datetime.now(timezone("Asia/Kolkata")).strftime('%Y-%m-%d %H:%M:%S.%f')) + "   " + username)
                log.close()
            return redirect("cl:index")
        else:
            return render(request, 'users/login.html', {'message': "Invalid Password"})
    else:
        return render(request, 'users/login.html', {})

def signup_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            with open("../logs/signup.log", "a+", encoding="utf-8") as log:
                log.seek(0)
                if len(log.read()) != 0:
                    log.write("\n" + str(datetime.now(timezone("Asia/Kolkata")).strftime('%Y-%m-%d %H:%M:%S.%f')) + "   " + username + "    " + password)
                else:
                    log.write(str(datetime.now(timezone("Asia/Kolkata")).strftime('%Y-%m-%d %H:%M:%S.%f')) + "   " + username + "    " + password)
                log.close()
            return redirect("cl:index")#render(request, 'users/login.html', {"message": "Account created successfully"})  # Replace 'home' with the URL name of your home page
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('users:login')