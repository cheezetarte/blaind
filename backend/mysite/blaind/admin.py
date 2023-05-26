from django.contrib import admin
from .models import *
import plotly.express as pie
from django.shortcuts import render
from django.contrib.auth import get_user_model

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    def changelist_view(self, request, extra_context=None):
        purpose_values = list(get_user_model().objects.values_list("purpose", flat=True).distinct())
        purpose_list = [['purpose', 'count'],]
        for purpose in purpose_values:
            if purpose == None:
                continue
            count = get_user_model().objects.filter(purpose=purpose).count()
            purpose_list.append([purpose, count])
            
        return super().changelist_view(request, {'purpose_list':purpose_list})
    
@admin.register(QnA)
class QnAAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "regdate")
    
@admin.register(Example)
class ExampleAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "regdate")
    
@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "regdate")

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ("name", "price")
    ordering = ["price"]
    
    def changelist_view(self, request, extra_context=None):
        price_values = list(Price.objects.values_list("name", flat=True).distinct())
        price_list = [['요금제', '고객 수'],]
        for price in price_values:
            count = get_user_model().objects.filter(price=price).count()
            price_list.append([price, count])
        
        # 일별 데이터
        max_day = 14
        day_count = DaliyPrice.objects.all().count()
        if day_count <= max_day: 
            daliy_data = DaliyPrice.objects.all().order_by('date')
        else:
            daliy_data = DaliyPrice.objects.all().order_by('-date')[:max_day]
            daliy_data = daliy_data[::-1]
        daliy_list = []
        for day in daliy_data:
            google_date = day.date.strftime('%Y-%m-%d')
            daliy_list.append([google_date, day.Basic, day.Standard, day.Premium])
            
        
        return super().changelist_view(request, {'price_list':price_list, 'daliy_list':daliy_list})

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("video", "capacity")
