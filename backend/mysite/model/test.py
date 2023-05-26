import api

temp = []
temp = api.crop_from_video('./example/2.mp4','123')
for t in temp:
    print(t)