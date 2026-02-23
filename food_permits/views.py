from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'food_permits/index.html')

def create(request):
    return render(request, 'food_permits/create.html')