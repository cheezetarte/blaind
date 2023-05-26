from .models import *
from .forms import *
from .serializers import *
from django.conf import settings
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.utils.html import strip_tags
from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model
from django.core.files.storage import FileSystemStorage
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import *
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.serializers import *
from rest_framework_simplejwt.exceptions import *
from django.shortcuts import render, get_object_or_404
from argon2 import PasswordHasher, exceptions
import jwt, os, random, base64, glob, io, cv2, re
from PIL import Image
import numpy as np
import model.api

def EncodeBase64(str):
    str_bytes = str.encode('ascii')
    str_base64 = base64.b64encode(str_bytes)
    result = str_base64.decode('ascii')
    return result

def DecodeBase64(str):
    str_bytes = base64.b64decode(str)
    result = str_bytes.decode('ascii')
    return result


def validpassword(password): # true, false 반환
    REGEX_PASSWORD = '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
    if not re.fullmatch(REGEX_PASSWORD, password):
        return False
    return True

def confirm_nickname(nickname):
    admin_list = ['blaind', 'admin', 'administrator', '관리자', '운영자', '관리', '운영']
    nickname = nickname.lower()
    for word in admin_list:
        if nickname.find(word) != -1:
            print("금지된 단어가 포함되어 있습니다. (관리자 관련 단어)")
            return False
    return True

# access token verify & refresh
class JWTAccessTokenAuth(APIView):
    def post(self, request):
        try:
            access_token = request.data['access_token']
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
            pk = payload.get('user_id')
            user = get_user_model().objects.get(id=pk)
            response = Response({
                'message' : 'success',
                'user_id' : user.id,
                'access_token': access_token,
                'refresh_token': request.data['refresh_token'],
                'is_staff' : user.is_staff
            }, status=status.HTTP_200_OK)
            return response

        # access_token 만료. 토큰 갱신.
        except(jwt.exceptions.ExpiredSignatureError):
            try:
                serializer = TokenRefreshSerializer(data={'refresh': request.data['refresh_token']})

                if serializer.is_valid():
                    access_token = serializer.validated_data['access']
                    refresh_token = request.data['refresh_token']
                    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms='HS256')
                    pk = payload.get('user_id')
                    user = get_user_model().objects.get(id=pk)
                    response = Response({
                        'message' : 'success',
                        'user_id' : user.id,
                        'access_token': access_token,
                        'refresh_token': refresh_token,
                    }, status=status.HTTP_200_OK)
                    return response
            except TokenError: # refresh token 만료.
                return Response({'message': '로그인이 만료되었습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

            raise jwt.exceptions.InvalidTokenError

        # 토큰 invalid
        except(jwt.exceptions.InvalidTokenError):
            return Response({'message': '로그인이 만료되었습니다.'}, status=status.HTTP_401_UNAUTHORIZED)


class LoginAPI(APIView):
    def post(self, request):
        try:
            user = get_user_model().objects.get(email=request.data['email'])
            if user.is_active == False:
                return Response({"message":"현재 비활성화된 계정입니다."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
            PasswordHasher().verify(user.password, request.data['password'])

            #jwt 생성
            token = TokenObtainPairSerializer.get_token(user)
            refresh_token = str(token)
            access_token = str(token.access_token)
            user.refresh_token = refresh_token
            response = Response({
                'message' : 'login success',
                'jwt_token':{
                    'access_token' : access_token,
                    'refresh_token' : refresh_token,
                },
            }, status=status.HTTP_200_OK)
            response['Set-Cookie'] = f'access_token={access_token}; refresh_token={refresh_token}'
            user.save()
            return response
        except (User.DoesNotExist, exceptions.VerifyMismatchError):
            return Response({'message' : '존재하지 않는 이메일이거나 비밀번호가 일치하지 않습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPI(APIView):
    def post(self, request):
        refresh = request.data['token']
        try:
            user = get_user_model().objects.get(refresh_token = refresh)
            user.refresh_token = None
            user.save()
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message':'올바르지 않는 로그인/로그아웃 입니다.'}, status=status.HTTP_401_UNAUTHORIZED)

class SignUpAPI(APIView):
    def find_user(self, request):
        checker = {}
        checker['email'] = get_user_model().objects.filter(email = request.data['email']).exists()
        checker['nickname'] = get_user_model().objects.filter(nickname = request.data['nickname']).exists()
        return checker
    
    def post(self, request):
        checker = self.find_user(request)
        if checker['email'] or checker['nickname']:
            return Response({"email" : checker['email'], "nickname" : checker['nickname'], "message" : "중복"}, 
                            status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
        if not validpassword(request.data['password']):
            return Response({"message": "password"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
        if not confirm_nickname(request.data['nickname']):
            return Response({"message" : "admin_nickname"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        try: 
            user_email = VerifyEmail.objects.get(email=request.data['email'])
                
        except VerifyEmail.DoesNotExist: # 이메일 인증 버튼을 누르지 않았을 경우, 새로운 메일 주소를 받았을 경우
            return Response({"message" : "이메일 인증버튼을 눌러 인증해주세요."}, status=status.HTTP_401_UNAUTHORIZED)
        if user_email.is_verify: # 인증 완료한 경우.
            serializer = SignUpSerializer(data=request.data)
            if serializer.is_valid():
                hash_pw = PasswordHasher().hash(serializer.validated_data['password'])
                serializer.validated_data['password'] = hash_pw
                serializer.save() # 회원가입 내용으로 회원 db 추가.
                user_email.delete() # 인증 완료 db에 해당 데이터 제거.
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else: # 인증 미완료
            return Response({"message" : "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요."},status=status.HTTP_401_UNAUTHORIZED)

class QnAList(APIView):
    def get(self, request): # 게시글 리스트 보여주기
        posts = QnA.objects.all().order_by('-regdate', '-regtime')
        
        serializer = QnASerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request): # 새 글 작성한 경우
        serializer = QnASerializer(data=request.data)
        user = get_user_model().objects.get(id=request.data['user_id'])
        if serializer.is_valid():
            serializer.validated_data['writer'] = user.nickname
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ExampleList(APIView):
    def get(self, request): # 게시글 리스트 보여주기
        posts = Example.objects.all().order_by('-regdate', '-regtime')
    
        serializer = ExampleSerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request): # 새 글 작성한 경우
        serializer = ExampleSerializer(data=request.data)
        user = get_user_model().objects.get(id=request.data['user_id'])
        if serializer.is_valid():
            serializer.validated_data['writer'] = user.nickname
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NoticeList(APIView):
    def get(self, request): # 게시글 리스트 보여주기
        posts = Notice.objects.all().order_by('-regdate', '-regtime')
        
        serializer = NoticeSerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request): # 새 글 작성한 경우
        serializer = NoticeSerializer(data=request.data)
        user = get_user_model().objects.get(id=request.data['user_id'])
        if serializer.is_valid():
            serializer.validated_data['writer'] = user.nickname
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NoticeDetail(APIView):
    def get_object(self, pk): # 게시글 객체 get
        try:
            return Notice.objects.get(pk=pk)
        except Notice.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None): # pk 이용하여 게시글 찾기
        post = self.get_object(pk)
        post.read_cnt += 1
        post.save() # 조회수 증가 후 저장
        serializer = NoticeSerializer(post)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None): # request 이용하여 해당 게시글 수정
        post = self.get_object(pk)
        serializer = NoticeSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None): # 게시글 삭제
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ExampleDetail(APIView):
    def get_object(self, pk): # 게시글 객체 get
        try:
            return Example.objects.get(pk=pk)
        except Example.DoesNotExist:
            raise Http404
    def get(self, request, pk, format=None): # pk 이용하여 게시글 찾기
        post = self.get_object(pk)
        post.read_cnt += 1 # 조회수 증가
        post.save()
        serializer = ExampleSerializer(post)
        return Response(serializer.data)
    def put(self, request, pk, format=None): # request 이용하여 해당 게시글 수정
        post = self.get_object(pk)
        serializer = ExampleSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None): # 게시글 삭제
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class QnADetail(APIView):
    def get_object(self, pk): # 게시글 객체 get
        try:
            return QnA.objects.get(pk=pk)
        except QnA.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None): # pk 이용하여 게시글 찾기
        post = self.get_object(pk)
        post.read_cnt += 1 # 조회수 증가
        post.save()
        serializer = QnASerializer(post)
        return Response(serializer.data)

    def put(self, request, pk, format=None): # request 이용하여 해당 게시글 수정
        post = self.get_object(pk)
        serializer = QnASerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None): # 게시글 삭제
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class QnAReplyView(APIView):
    def get_object(self, pk): # 게시글 객체 get
        try:
            return QnA.objects.get(pk=pk)
        except QnA.DoesNotExist:
            raise Http404
    
    def get(self, request, pk):
        replys = QnAReply.objects.filter(post_id = pk)
        serializer = QnAReplySerializer(replys, many=True)
        return Response(serializer.data)

    def post(self, request, pk): # 새 글 작성한 경우
        payload = jwt.decode(request.data['token'], settings.SECRET_KEY, algorithms='HS256')
        user = get_user_model().objects.get(id=payload['user_id'])
        writer = user.nickname
        new_request = {'post_id':pk, 'writer': writer, 'content': request.data['content']}
        serializer = QnAReplySerializer(data=new_request)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def delete(self, request,post_id,pk,format = None):
    #     post = self.get_object(pk)
    #     post.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)

class NoticeReplyView(APIView):
    def get(self, request, post_id):
        replys = NoticeReply.objects.filter(post_id = post_id)
        serializer = NoticeReplySerializer(replys, many=True)
        return Response(serializer.data)

    def post(self, request): # 새 글 작성한 경우
        serializer = NoticeReplySerializer(
            data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request,post_id,pk,format = None):
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ExampleReplyView(APIView):
    def get(self, request, post_id):
        replys = ExampleReply.objects.filter(post_id = post_id)
        serializer = ExampleReplySerializer(replys, many=True)
        return Response(serializer.data)

    def post(self, request): # 새 글 작성한 경우
        serializer = ExampleReplySerializer(
            data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,post_id,pk,format = None):
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class VideoViewSet(viewsets.ViewSet):
    parser_classes = (MultiPartParser, )
    
    # video, token 받아옴.
    def create(self, request): 
        files = request.FILES['file']
        if str(files)[-3:] != 'mp4':
            return Response({"message" : "mp4 확장자만 이용이 가능합니다."}, status=status.HTTP_400_BAD_REQUEST)
        token = request.data['token']
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        user = get_user_model().objects.get(id = payload['user_id'])
        nickname = user.nickname
        
        filesize = request.FILES['file'].size
        # upper_capacity = 200*1024*1024
        # if user.price  == 'Premium':
        #     upper_capacity = 5*1024*1024*1024
        # elif user.price ==  'Standard':
        #     upper_capacity = 1024*1024*1024
        
        if filesize>user.price.capacity:
            return Http404("해당 용량은 해당 요금제에서 사용하실 수 없습니다.")
            
        user_path = str(settings.MEDIA_ROOT) + f'\{nickname}'
        video_path = user_path + '\\video'

        os.makedirs(user_path, exist_ok=True)
        os.makedirs(video_path, exist_ok=True)
            
        fs = FileSystemStorage(location=video_path) # 비디오 파일 저장
        # 비디오 파일 경로 : media\(유저 닉네임)\video\
        filename = fs.save(files.name, files)
        file_path = fs.url(nickname+'/video/'+filename)
        
        video = Video.objects.create(video=filename, video_path=file_path)
        video.save()
        serializer = VideoSerializer(video)

        return Response(serializer.data)

class UserProfile(APIView):
    def post(self, request):
        token = request.data["token"]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        user = get_user_model().objects.get(id = payload['user_id'])
        serializer = ProfileSerializer(user)
        return Response(serializer.data)
    
class UpdateProfile(APIView):
    def post(self, request):
        message = []
        token = request.data['token']
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        user = get_user_model().objects.get(id = payload['user_id'])
        if request.data['password'] != '':
            if validpassword(request.data['password']):
                user.password = PasswordHasher().hash(request.data['password'])
            else:
                message.append("비밀번호는 8자 이상, 문자, 숫자, 특수문자가 1자 이상이어야 합니다.")
        if request.data['nickname'] != '':
            if not confirm_nickname(request.data['nickname']):
                message.append("해당 닉네임을 사용할 수 없습니다. (관리자 관련 단어 포함)")
            elif get_user_model().objects.filter(nickname=request.data['nickname']).exists():
                message.append("입력하신 닉네임은 이미 존재합니다. 다른 닉네임을 입력해주세요.")
            else:
                user.nickname = request.data['nickname']

        photo = request.POST.get('profile_photo', None)
        if photo != None:    
            if request.data['profile_photo'] != user.profile_photo:
                user.profile_photo = request.data['profile_photo']
            
        user.save()
        
        return Response({"message" : message}, status=status.HTTP_200_OK)

#### 메일 보내기 관련 ####

class SendVerifyEmail(APIView): # 회원가입 이메일 인증 메일 보내기.
    def post_mail(self, get_email, number):
        user_email = VerifyEmail.objects.get(email=get_email)
        subject = '[BLAIND] 회원가입 이메일 인증 메일입니다.'
        message = render_to_string('blaind/verify_email.html',
        {
            'email': EncodeBase64(get_email),
            'number': EncodeBase64(str(number))
        })
        send_mail(subject, '', f'BLAIND <{settings.DEFAULT_FROM_EMAIL}>', [str(get_email)], html_message=message)
    
    def post(self, request):
        # 가입된 메일 중복 체크
        if get_user_model().objects.filter(email=request.data['email']).exists():
            return Response({"message" : "exists"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            verify_email = VerifyEmail.objects.get(email=request.data['email'])
            random_number = verify_email.number
        except VerifyEmail.DoesNotExist:
            random_number = random.randint(1, 1000000)
            user_email = VerifyEmail.objects.create(email=request.data['email'], number=random_number)
            user_email.save()
        self.post_mail(request.data['email'], random_number)
        return Response(status=status.HTTP_200_OK)
    
class VerifyUserEmail(APIView): # 이메일 인증 확인
    def get(self, request, get_email, get_number):
        get_email = DecodeBase64(get_email)
        get_number = DecodeBase64(get_number)
        verify_email = VerifyEmail.objects.get(email=get_email)
        if get_number == str(verify_email.number):
            verify_email.is_verify = 1
            verify_email.save()
            return render(request, 'blaind/verified.html')
        else:            
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
class SendPasswordEmail(APIView): # 비밀번호 재설정 링크 보내기
    def post_mail(self, get_email):
        user = get_user_model().objects.get(email=get_email)
        subject = '[BLAIND] 비밀번호 재설정 메일입니다.'
        message = render_to_string('blaind/reset_password.html', {
            'email' : EncodeBase64(get_email),
            'nickname' : user.nickname
        })
        send_mail(subject, '', f'BLAIND <{settings.DEFAULT_FROM_EMAIL}>', [str(get_email)], html_message=message)
    def post(self, request):
        try:
            user = get_user_model().objects.get(username=request.data['name'])
            if user.email == request.data['email']:
                self.post_mail(request.data['email'])
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message' : '존재하지 않는 유저입니다.'}, status=status.HTTP_401_UNAUTHORIZED)

class ConfirmEmail(APIView): # 재설정 메일 확인
    def get(self, request, get_email):
        email = DecodeBase64(get_email)
        try:
            user = get_user_model().objects.get(email=email)
            return Response({'email' : get_email, 'message' : 'success'}, status=status.HTTP_200_OK)
        except get_user_model().DoesNotExist:
            return Response({'message' : '존재하지 않는 유저입니다.'}, status=status.HTTP_401_UNAUTHORIZED)
    
class ResetPassword(APIView): # 비밀번호 재설정 class
    def get(self, request, get_email):
        email = DecodeBase64(get_email)
        try:
            user = get_user_model().objects.get(email=email)
            return Response({'email' : email, 'message' : 'success'}, status=status.HTTP_200_OK)
        except get_user_model().DoesNotExist:
            return Response({'message' : '존재하지 않는 유저입니다.'}, status=status.HTTP_401_UNAUTHORIZED)
        
    def post(self, request):
        user = get_user_model().objects.get(email=request.data['email'])
        if validpassword(request.data['password']):
            new_password = PasswordHasher().hash(request.data['password'])
            user.password = new_password
            user.save()
            return Response({"message" : "비밀번호 재설정을 완료하였습니다."} ,status=status.HTTP_200_OK)
        else:
            return Response({"message": "비밀번호는 8자 이상, 숫자, 문자, 특수문자가 1자 이상이어야 합니다."}, status=status.HTTP_400_BAD_REQUEST)

        
        
# 모델 처리 과정 정리
    """
    1. Video File Upload (Video Path가 지정 됨)
    2. Video Path를 가져와서 ModelAPI에 적용
    3. ModelAPI를 돌림
    4. result 폴더 안에 각 인물별 사진(2번째꺼) 가져와서 FE로 전달
    5. FE CheckBox의 Label Value 받아옴 -> Lable Value를 Model API에 적용
    6. ...
    
    @ user_path = backend/mysite/media
    """
class RunModelView(APIView):    # Video Path 받아와서 Model API 돌리기
    def post(self, request):  # VideoViewSet 참고해서 작성
        print(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
        token = request.data['token']
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        user = get_user_model().objects.get(id = payload['user_id'])
        nickname = user.nickname
        video_path = request.data['video_path']
        print("video_path : " + video_path)
        image_list = model.api.crop_from_video(video=video_path, nickname=nickname)
        
        data = {
            'image_list':image_list
        }
        return Response(data)
    
class CropImageDecode(APIView): # base64 Decode
    def post(self, request):
        base64_str = request.data['base64_str']
        image_data = base64.b64decode(base64_str)
        dataBytesIO = io.BytesIO(image_data)
        image = Image.open(dataBytesIO)
        crop_image = cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)
        
        return Response(crop_image)

class BlurTargetView(APIView):  # 블러처리 api
    def post(self, request):
        check = request.data['']
        model.api.blur_selected_face()
        pass

class  SendEditedVideo(APIView):
    def post(self, request):
        selected_face = request.data['selected_face']
        origin_video = request.data['video_path']
        nickname = request.data['nickname']
        sigma = int(request.data['sigma'])
        edited_video = model.api.blur_selected_face(selected_face, origin_video, nickname, sigma)
        data = {'edited_video':edited_video}
        return Response(data)

class SendStickerVideo(APIView):
    def post(self, request):
        selected_face = request.data['selected_face']
        origin_video = request.data['video_path']
        nickname = request.data['nickname']
        sticker = request.data['sticker']
        edited_video = model.api.sticker_selected_face(selected_face, origin_video, nickname, sticker)
        data = {'edited_video':edited_video}
        return Response(data)