from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.contrib.contenttypes.fields import GenericRelation
from django.conf import settings
from django.core.exceptions import ValidationError


# Create your models here.
class Price(models.Model):
    name = models.CharField(max_length=50, primary_key=True)
    price = models.IntegerField()
    resolution = models.IntegerField(default=720) # 해상도
    capacity = models.BigIntegerField(default=200*1024*1024) # Basic = 200MB
    
    class Meta:
        db_table = 'Price'
    
    def __str__(self):
        return self.name

class DaliyPrice(models.Model): # price 일별 데이터
    date = models.DateField()
    Basic = models.BigIntegerField(default=0)
    Standard = models.BigIntegerField(default=0)
    Premium = models.BigIntegerField(default=0)
    
    class Meta:
        db_table = 'DaliyPrice' 
# class Board(models.Model):
#     board_id = models.AutoField(primary_key=True)
#     board_name = models.CharField(max_length=50)

#     class Meta:
#         db_table = 'Board'

#     def __str__(self):
#         return self.board_name

class VerifyEmail(models.Model): # 이메일 인증을 위한 db
    email = models.EmailField(max_length=255, unique=True)
    number = models.IntegerField(default=0)
    is_verify = models.BooleanField(default=False)

    class Meta:
        db_table = 'VerifyEmail'


class User(AbstractUser):
    email = models.EmailField(max_length=255,unique=True,)
    username = models.CharField(max_length=40, unique=False)
    nickname = models.CharField(max_length=20, unique=True)

    # 사용하지 않는 AbstractUser 데이터는 None 처리.
    first_name = None
    last_name = None
    last_login = None
    date_joined = None
    
    profile_photo = models.ImageField(blank=True, upload_to='profile')
    purpose = models.CharField(max_length=50, blank=True, null=True)
    user_type=models.CharField(max_length=50, default='personal', null=True)
    price = models.ForeignKey("Price", on_delete=models.DO_NOTHING, db_column="price", null=True)
       
    #jwt token
    refresh_token = models.TextField(blank=True, null=True)

    payment_date = models.DateTimeField(null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    class Meta:
        db_table = 'User'
        
    def __str__(self):
        return self.nickname

class QnAFile(models.Model):
    file_id = models.BigAutoField(primary_key=True)
    post_id = models.ForeignKey("QnA", on_delete=models.CASCADE, db_column="post_id")
    filename = models.CharField(max_length=100)
    regdate = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'QnAFile'
        
class ExampleFile(models.Model):
    file_id = models.BigAutoField(primary_key=True)
    post_id = models.ForeignKey("Example", on_delete=models.CASCADE, db_column="post_id")
    filename = models.CharField(max_length=100)
    regdate = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ExampleFile'
        
class NoticeFile(models.Model):
    file_id = models.BigAutoField(primary_key=True)
    post_id = models.ForeignKey("Notice", on_delete=models.CASCADE, db_column="post_id")
    filename = models.CharField(max_length=100)
    regdate = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'NoticeFile'

class QnA(models.Model):
    post_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey("User", on_delete=models.DO_NOTHING, db_column="user_id", null=True) # 추후에 null=True 삭제할 것
    title = models.CharField(max_length=50)
    writer = models.CharField(max_length=20, blank=True)
    content = models.TextField()
    regdate = models.DateField(auto_now_add=True)
    regtime = models.TimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    # board_id = models.ForeignKey("Board", related_name="board", on_delete=models.CASCADE, db_column="board_id")
    read_cnt = models.BigIntegerField(default=0)
    
    class Meta:
        db_table = 'QnA'
    
    def __str__(self):
        return self.title
    
class Example(models.Model):
    post_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey("User", on_delete=models.DO_NOTHING, db_column="user_id", null=True) # 추후에 null=True 삭제할 것
    title = models.CharField(max_length=50)
    writer = models.CharField(max_length=20, blank=True)
    content = models.TextField()
    regdate = models.DateField(auto_now_add=True)
    regtime = models.TimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    # board_id = models.ForeignKey("Board", related_name="board", on_delete=models.CASCADE, db_column="board_id")
    read_cnt = models.BigIntegerField(default=0)
    
    class Meta:
        db_table = 'Example'
    
    def __str__(self):
        return self.title

class Notice(models.Model):
    post_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey("User", on_delete=models.DO_NOTHING, db_column="user_id", null=True) # 추후에 null=True 삭제할 것
    title = models.CharField(max_length=50)
    writer = models.CharField(max_length=20, blank=True)
    content = models.TextField()
    regdate = models.DateField(auto_now_add=True)
    regtime = models.TimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    # board_id = models.ForeignKey("Board", related_name="board", on_delete=models.CASCADE, db_column="board_id")
    read_cnt = models.BigIntegerField(default=0)
    
    class Meta:
        db_table = 'Notice'
    
    def __str__(self):
        return self.title

class QnAReply(models.Model):
    post_id = models.ForeignKey("QnA", on_delete=models.CASCADE, db_column="post_id")
    reply_id = models.BigAutoField(primary_key=True)
    writer = models.CharField(max_length=20)
    content = models.TextField()
    regdate = models.DateField(auto_now_add=True)
    regtime = models.TimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    image = models.ImageField(blank=True)
    
    class Meta:
        db_table = 'QnAReply'

class ExampleReply(models.Model):
    post_id = models.ForeignKey("Example", on_delete=models.CASCADE, db_column="post_id")
    reply_id = models.BigAutoField(primary_key=True)
    writer = models.CharField(max_length=20)
    content = models.CharField(max_length=1000)
    regdate = models.DateTimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    image = models.ImageField(blank=True)

    class Meta:
        db_table = 'ExampleReply'
        
class NoticeReply(models.Model):
    post_id = models.ForeignKey("Notice", on_delete=models.CASCADE, db_column="post_id")
    reply_id = models.BigAutoField(primary_key=True)
    writer = models.CharField(max_length=20)
    content = models.TextField()
    regdate = models.DateField(auto_now_add=True)
    regtime = models.TimeField(auto_now_add=True)
    updatedate = models.DateTimeField(auto_now=True)
    image = models.ImageField(blank=True)

    class Meta:
        db_table = 'NoticeReply'

class Video(models.Model):
    video = models.FileField(blank=True, null=True)
    video_path = models.CharField(max_length=300, blank=True)
    download_date = models.DateTimeField(blank=True, null=True)
    capacity = models.BigIntegerField(blank=True, null=True)
    
    class Meta:
        db_table = 'video'