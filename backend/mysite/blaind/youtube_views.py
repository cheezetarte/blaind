from django.conf import settings
from rest_framework.views import APIView
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from rest_framework.response import Response
from rest_framework import status

client_id = settings.CLIENT_ID
client_secret = settings.CLIENT_SECRET
secret_file = settings.SECRET_FILE

class UploadYoutube(APIView):
    def post(self, request):
        title = request.data['title']
        description = request.data['description']
        flow = InstalledAppFlow.from_client_secrets_file(
            secret_file, 
            scopes=['https://www.googleapis.com/auth/youtube.upload',
                    ])
        flow.run_local_server(open_browser=True, timeout_seconds=60)
        token = flow.credentials.token
        creds = Credentials.from_authorized_user_info(
            info={
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': 'http://localhost:8000/youtube/',
                'refresh_token': token
            }
        )
        file_path = './media/PDM/video/KakaoTalk_20221229_110442086.mp4' # 변경 필요.
        media = MediaFileUpload(
            file_path,
            mimetype="video/mp4",
            chunksize=1024*1024*1024*64, # 64GB
            resumable=True)
        service = build('youtube', 'v3', credentials=creds)
        request = service.videos().insert(
            part='snippet,status',
            body={
                'snippet': {
                    'title': title,
                    'description': description
                },
                'status': {
                    'privacyStatus': 'private'
                }
            },
            media_body=media
        )
        request.execute()
        return Response(status=status.HTTP_200_OK)