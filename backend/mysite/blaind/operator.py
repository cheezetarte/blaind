import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from apscheduler.executors.pool import ProcessPoolExecutor, ThreadPoolExecutor
from django_apscheduler.jobstores import register_events, DjangoJobStore
from .corns import *


def start():
    scheduler=BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), 'djangojobstore')
    register_events(scheduler)
    # 매일 오전 10시마다 실행
    @scheduler.scheduled_job('cron', hour=10, minute=0, name = 'daliy')
    def daliy():
        add_daliy_price()
    scheduler.start()