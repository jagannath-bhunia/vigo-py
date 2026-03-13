from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import UserForm

# show login page
def login_page(request):
    return render(request, 'login.html', {'form': UserForm})


def user_login(request):

    if request.user.is_authenticated:
        return redirect('dashboard:home')

    if request.method == "POST":

        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard:home')

        return render(request, 'login.html', {
            'form': UserForm(),
            'error': 'Invalid credentials'
        })

    return render(request, 'login.html', {'form': UserForm()})

def user_logout(request):
    logout(request)
    return redirect('login')