from .models import *
from django.contrib.auth import get_user_model
import datetime

def add_daliy_price():
    date = datetime.datetime.now()
    basic_count = get_user_model().objects.filter(price="Basic").count()
    standard_count = get_user_model().objects.filter(price="Standard").count()
    premium_count = get_user_model().objects.filter(price="Premium").count()
    
    # 당일 일별 데이터가 없을 경우 추가
    if not DaliyPrice.objects.filter(date=date).exists():
        data = DaliyPrice.objects.create(date=date)
        data.Basic=basic_count 
        data.Standard=standard_count
        data.Premium=premium_count

        data.save()
    else:
        print(f"{date} 데이터가 이미 존재합니다!")