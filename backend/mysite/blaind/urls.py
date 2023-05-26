from .views import *
from .youtube_views import *
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

app_name = 'blaind'
urlpatterns = [
    path('qna/', QnAList.as_view()),
    path('qna/<int:pk>/', QnADetail.as_view()),
    path('example/', ExampleList.as_view()),
    path('example/<int:pk>/', ExampleDetail.as_view()),
    path('notice/', NoticeList.as_view()),
    path('notice/<int:pk>/', NoticeDetail.as_view()),
    
    path('example/<int:pk>/reply/',ExampleReplyView.as_view()),
    path('notice/<int:pk>/reply/',NoticeReplyView.as_view()),
    path('qna/<int:pk>/reply/',QnAReplyView.as_view()),
    
    
    path('upload/', VideoViewSet.as_view({'post':'create'})),
    path('signup/', SignUpAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('logout/', LogoutAPI.as_view()),
    path('getprofile/', UserProfile.as_view()),
    path('updateprofile/', UpdateProfile.as_view()),
    # access_token verify & refresh
    path('verifyToken/', JWTAccessTokenAuth.as_view()), 
    path('verifyEmail/<str:get_email>/<str:get_number>/', VerifyUserEmail.as_view()), 
    path('verifyEmail/', VerifyUserEmail.as_view()), 
    path('sendEmail/', SendVerifyEmail.as_view()),
    # path('facelist/',CropImageView.as_view()),
    
    path('sendPasswordEmail/', SendPasswordEmail.as_view()),
    path('confirmEmail/<str:get_email>/', ConfirmEmail.as_view()),
    path('facelist/', RunModelView.as_view()),
    path('resetPassword/<str:get_email>/', ResetPassword.as_view()),
    path('resetPassword/', ResetPassword.as_view()),
    path('getVideo/', SendEditedVideo.as_view()),
    path('stickerVideo/', SendStickerVideo.as_view()),
    path('youtube/', UploadYoutube.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)