from django.urls import path
from . import views
app_name = "fee"

urlpatterns = [
    path('permit-fee', views.permit_fee, name='permit_fee'),
   
]