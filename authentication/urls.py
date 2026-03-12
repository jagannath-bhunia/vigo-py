from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_page, name='login'),
    path('user-login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='logout'),
]