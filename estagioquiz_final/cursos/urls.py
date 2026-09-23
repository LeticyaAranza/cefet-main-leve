from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('informatica/', views.informatica, name='informatica'),
    path('mecatronica/', views.mecatronica, name='mecatronica'),
    path('edificacoes/', views.edificacoes, name='edificacoes'),
    path('api/chatbot/', views.chatbot_api, name='chatbot_api'),
]