from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import UserForm

# show login page
def login_page(request):
    return render(request, 'login.html', {'form': UserForm})


def user_login(request):
    
    if request.method == "POST":
        
        username = request.POST['email']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        # print(user)
        if user is not None:
            login(request, user)
            return redirect('dashboard:home')
        else:
            return render(request, 'login.html', {'form': UserForm,'error': 'Invalid credentials'})
        
    return render(request, 'login.html', {'form': UserForm()})

def user_logout(request):
    logout(request)
    return redirect('login')