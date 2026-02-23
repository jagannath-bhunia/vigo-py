from django.apps import AppConfig
from flask import Blueprint, render_template


class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dashboard'

