from django.urls import path
from .views import RegisterView, LoginView, TaskView, TaskDetailView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('tasks/', TaskView.as_view()),
    path('tasks/<int:id>/', TaskDetailView.as_view()),
]
