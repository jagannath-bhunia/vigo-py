from django.urls import path
from . import views
app_name = "food"

urlpatterns= [
    path('',views.index, name='food_index'),
    path('/craete',views.create, name='food_create'),

]