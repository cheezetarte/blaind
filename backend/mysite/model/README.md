
# 1. def crop_from_video()

* 사용자가 업로드한 비디오 파일을 불러옴
* 얼굴 encoding 값을 기준으로, 영상에서 인식한 얼굴을 같은 사람별로 분류
* 사람 얼굴 목록을 반환함

# 2. def blur_selected_face(user_select, video)

* 사용자가 선택한 label 리스트와 업로드한 비디오를 불러옴
* 선택한 얼굴 encoding 값과 프레임별 얼굴 encoding 값을 비교
* 같은 사람으로 인식되는 경우 블러 제외시킴
* 얼굴에 블러 적용이 완료되면 영상 파일 저장

# 3. def sticker_selected_face(user_select, video, sticker)

* 사용자가 선택한 label 리스트와 업로드한 비디오를 불러옴
* 선택한 얼굴 encoding 값과 프레임별 얼굴 encoding 값을 비교
* 같은 사람으로 인식되는 경우 스티커 제외시킴
* 얼굴에 스티커 적용이 완료되면 영상 파일 저장



# Usage


```python
import api

api.crop_from_video('videoname')
api.blur_selected_face(user_select, 'vieoname')
api.sticker_selected_face(user_select, 'videoname', sticker_label)
```

# Result

`crop_from_video` 함수 실행 결과는 `result` 폴더에 저장됨.

* 크롭된 사람들의 얼굴은 `person_##` 폴더에 들어있음.
* 인식되지 않은 사람의 얼굴은 `unknowns` 폴더에 들어있음.
* 임의로 얼굴 이미지를 폴더별로 이동시켜주면 성능이 향상됨.

`blur_selected_face` 함수 실행 결과는 `src_dir` 폴더에 저장됨.

* 원본 비디오는 `src_dir` 폴더에 들어있음.
* `out` : 동영상 파일로 리턴
* `out_file` : 동영상 파일이 저장되는 path로 리턴

`sticker_selected_face` 함수 실행 결과는 `src_dir` 폴더에 저장됨.

* 적용시킬 스티커 이미지는 `sticker_dir` 폴더에 들어있음.
* `out` : 동영상 파일로 리턴
* `out_file` : 동영상 파일이 저장되는 path로 리턴


# Example Result


```python
import api

temp = []
temp = api.crop_from_video('2.mp4')
for t in temp:
    print(t)
```

![example.PNG](./example/example.PNG)
