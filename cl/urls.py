from django.urls import path
from . import views

app_name = 'cl'
urlpatterns = [
    path("", views.index, name ="index"),
    path('hob/', views.hob, name='hob'),
    path('similar/', views.similar, name='similar'),
    ]