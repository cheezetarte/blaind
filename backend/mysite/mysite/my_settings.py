DATABASES = {
    'default' : {
        'ENGINE' : 'django.db.backends.mysql',
        'NAME' : 'blaind_db',
        'USER' : 'admin',
        'PASSWORD' : 'django123',
        'HOST' : 'blainddb.c5ehygqdito3.ap-northeast-2.rds.amazonaws.com',
        'PORT' : '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset'     : 'utf8mb4',
            'use_unicode' : True,
        },
    }
}

# DATABASES = {
#     'default' : {
#         'ENGINE' : 'django.db.backends.mysql',
#         'NAME' : 'blaind_db',
#         'USER' : 'root',
#         'PASSWORD' : 'root',
#         'HOST' : 'localhost',
#         'PORT' : '3306',
#     }
# }

SECRET_KEY = 'django-insecure-cz#p!qh9&nm5ao(s1@^jt3mhx0+d7k=6va*$o-93zo$1njab!-'

