from django.urls import path
from . import views

app_name = 'cl'
urlpatterns = [
    path("", views.index, name ="index")
    
    ]