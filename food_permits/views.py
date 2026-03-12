from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from fee.models import Fee

# Create your views here.
@login_required
def index(request):
    return render(request, 'food_permits/index.html')

def create(request):
    
    fees = Fee.objects.filter(master_permit_type_id=1)

    return render(request, 'food_permits/create.html', {'fees':fees})