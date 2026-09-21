from django.urls import path
from . import views

urlpatterns = [
    path('', views.evacuacion_view, name='evacuacion_coderider'),
    path('panel/', views.panel_view, name='panel_coderider'),
]