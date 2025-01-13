from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User registered successfully!'})

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)
        refresh = RefreshToken.for_user(user)
        return Response({'token': str(refresh.access_token)})

class TaskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            task = Task.objects.get(id=id, user=request.user)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        try:
            task = Task.objects.get(id=id, user=request.user)
            task.delete()
            return Response({'message': 'Task deleted'})
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=404)
