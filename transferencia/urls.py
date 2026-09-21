from django.urls import path
from . import views

urlpatterns = [
    path('', views.fn_getpost_transferencia, name='transferencia'),
]