from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class QnASerializer(serializers.ModelSerializer):
    class Meta:
        model = QnA
        fields = '__all__'
        
class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = '__all__'
        
class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'
        
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['video', 'video_path']
        
class SignUpSerializer(serializers.ModelSerializer): # 회원가입 Serializer
    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'nickname', 'purpose', 'user_type', 'price']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class QnAReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = QnAReply
        fields = '__all__'

class ExampleReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleReply
        fields = '__all__'

class NoticeReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeReply
        fields = '__all__'
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'