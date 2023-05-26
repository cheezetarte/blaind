import glob
import cv2
import matplotlib.pylab as plt
import cv2
import face_recognition as fr
import glob
import os

from model.face_classifier import *


def crop_from_video(video, nickname):
    '''
    비디오 파일을 받아서, 서로 다른 사람의 얼굴을 한장씩 사진으로 자른다음 리스트로 리턴

    :param video: 비디오 파일 이름

    :return: 크롭된 사람 얼굴 (.png) 파일 리스트

    '''
    import signal
    import time
    import os

    # 1. open video
    # FIXME: set video path
    src_dir = "" # <<<<< (다민) 이부분에 불러올 video 디렉토리 path 넣어주세요
    src_file = os.path.join(src_dir, video)
    if src_file == "0":
        src_file = 0

    src = cv2.VideoCapture(src_file)
    if not src.isOpened():
        print("cannot open inputfile", src_file)
        exit(1)

    frame_rate = src.get(5)
    frames_between_capture = int(round(frame_rate * 0.5))
    
    print("source", src_file)
    print("original: %dx%d, %f frame/sec" % (src.get(3), src.get(4), frame_rate))
    

    # 2. resize-ratio
    ratio = float(1.0)
    if ratio != 1.0:
        s = "RESIZE_RATIO: " + 1.0
        s += " -> %dx%d" % (int(src.get(3) * ratio), int(src.get(4) * ratio))
        print(s)
    print("process every %d frame" % frames_between_capture)
    print("similarity shreshold:", 0.42)


    # 3. load person DB & prepare capture directory
    # FIXME: set result path 
    # 본인 경로 맞게 수정
    result_dir = 'C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/'+nickname+"/result/" # <<<<< (다민) 이부분에 output 저장할 디렉토리 path 넣어주세요
    pdb = PersonDB()
    pdb.load_db(result_dir)
    pdb.print_persons()
    
    num_capture = 0
    if result_dir:
        print("Captured frames are saved in '%s' directory." % result_dir)
        if not os.path.isdir(result_dir):
            os.mkdir(result_dir)



    # def signal_handler(sig, frame): # 키보드 인터럽트 감지시 signal module 사용
    #     global running
    #     running = False
    # prev_handler = signal.signal(signal.SIGINT, signal_handler)
     
    
    # 4. crop face images by person
    fc = FaceClassifier(0.42, ratio) # params : similarity threshold, resize-ratio
    frame_id = 0
    running = True

    total_start_time = time.time()
    while running:
        ret, frame = src.read()
        if not ret:
            break

        frame_id += 1
        if frame_id % frames_between_capture != 0:
            continue

        faces = fc.detect_faces(frame) # face object list
        for face in faces:
            person = fc.compare_with_known_persons(face, pdb.persons)
            if person:
                continue
            person = fc.compare_with_unknown_faces(face, pdb.unknown.faces)
            if person:
                pdb.persons.append(person)

        if result_dir:
            for face in faces:
                fc.draw_name(frame, face)
            if result_dir and len(faces) > 0:
                now = datetime.now()
                filename = now.strftime('%Y%m%d_%H%M%S.%f')[:-3] + '.png'
                pathname = os.path.join(result_dir, filename)
                cv2.imwrite(pathname, frame)
                num_capture += 1
            cv2.imshow("Frame", frame)

            
            key = cv2.waitKey(1) & 0xFF # imshow always works with waitKey
            if key == ord("q"): # if the `q` key was pressed, break from the loop
                running = False

    
    # 5. close video
    # signal.signal(signal.SIGINT, prev_handler)
    running = False
    src.release() # open 된 video 닫기
    total_elapsed_time = time.time() - total_start_time
    print()
    print("total elapsed time: %.3f second" % total_elapsed_time)

    pdb.save_db(result_dir)
    pdb.print_persons()


    # 6. return known_person_list : person 별 .png 파일 리스트
    # FIXME: 혹시 영상 결과에 출력 안되면 확인할 것
    # 본인 경로 맞게 수정
    file_list = glob.glob('C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/'+nickname+'/result/person_*', recursive=True)  
    i=0
    known_person_list=[]
    for i in range(0, len(file_list)) :
        x=(glob.glob(file_list[i]+'/*.png')[1])
        known_person_list.append(x)

    # plt show : 로컬에서 작업 확인용
    # c=len(known_person_list)
    # j=1
    # fig=plt.figure()
    # for f in known_person_list :
    #     img = cv2.imread(f)
    #     ax = fig.add_subplot(1, c, j)
    #     ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    #     ax.set_xticks([]), ax.set_yticks([])
    #     j += 1

    # plt.show()


    return known_person_list


def selected_face_list(user_select, nickname):
    '''
    사용자가 선택한 얼굴 이미지 label 받아와서 해당 이미지(.png) 리스트로 리턴

    :param: 사용자가 선택한 label

    :return: 선택된 사람 얼굴 (.png) 파일 리스트

    '''
    # 본인 경로 맞게 수정
    file_list = glob.glob('C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/'+nickname+'/result/person_*', recursive=True)  
    a=[]
    for i in range(0, len(file_list)) :
        x=(glob.glob(file_list[i]+'/*.png')[1])
        a.append(x)
        a.sort()
    user_select = list(map(int, user_select))
    selected_list = []
    for i in user_select:
        selected_list.append(a[i])
    return selected_list


def blur_selected_face(user_select, video, nickname, sigma):
    '''
    사용자가 선택한 얼굴 이미지 label 받아서 모자이크를 적용 후 video 파일로 리턴 

    :param: 선택된 얼굴 이미지 label 리스트, video 파일 이름

    :return: 모자이크된 video 파일

    '''
    
    # 1. original video
    # 본인 경로 맞게 수정
    src_dir = 'C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/' # (도현다민) 이부분에 불러올 video 디렉토리 path 넣어주세요
    src_file = os.path.join(src_dir, video[28:])
    selected_face = selected_face_list(user_select, nickname)
    if src_file == "0":
        src_file = 0

    cap = cv2.VideoCapture(src_file)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))                          
    ret,frame=cap.read()  

    count=0          
    
    # (도현다민) 리턴 파일 수정해주세요
    # 2. return video
    out_file = src_dir+nickname+'/video'+"/Output.mp4"
    out = cv2.VideoWriter(out_file, cv2.VideoWriter_fourcc(*"mp4v"), cap.get(cv2.CAP_PROP_FPS),(w,h))
    

    # 3. selected face encoding
    selected_face_encodings  = [ ]
    for i in range(0 , len(selected_face)):
        chose_image = fr.load_image_file(selected_face[i])
        chose_encoding = fr.face_encodings(chose_image, model='hog')[0]
        selected_face_encodings.append(chose_encoding)

    # 4. open video & blur face
    while cap.isOpened():
        ret,frame = cap.read()                           
        
        if ret == True:
            count = count+1
            frame1 = frame[:, :, ::-1]                                    
            face_locations = fr.face_locations(frame1, model='hog')
            face_encodings = fr.face_encodings(frame,face_locations, model='hog')


            for j,face_encoding in enumerate(face_encodings):
            
                result = fr.compare_faces(selected_face_encodings,face_encoding,tolerance=0.54)
              
                if not  1 in result :     
                    f = face_locations[j]
                    print (f)
                    top, right, bottom, left = f[0],f[1],f[2],f[3]
                    
                    face =frame[top:bottom, left:right]
                    face = cv2.medianBlur(face,35,5)
                    face = cv2.GaussianBlur(face,(35,5),sigma)
                    frame[top:bottom, left:right]=face
                
                out.write(frame)
        else : 
            cap.release()

    # 5. close video
    out.release()
    out_dir = out_file[:-11] + '/Output_encode.mp4'
    cv2.destroyAllWindows()
    os.system(f'ffmpeg -i {out_file} -vcodec libx264 {out_dir} -y')
    os.remove(out_file)
    return out_dir


def sticker_selected_face(user_select, video, nickname, sticker):
    '''
    사용자가 선택한 얼굴 이미지 label 받아서 스티커 적용 후 video 파일로 리턴 

    :param: 선택된 얼굴 이미지 label 리스트, video 파일 이름, 스티커 이미지 label 

    :return: 모자이크된 영상 리턴

    '''
    selected_face = selected_face_list(user_select, nickname)

    # 1. original video
    src_dir = 'C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/' # (도현다민) 이부분에 불러올 video 디렉토리 path 넣어주세요
    src_file = os.path.join(src_dir, video[28:])
    if src_file == "0":
        src_file = 0

    cap = cv2.VideoCapture(src_file)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))                          
    ret,frame=cap.read()  

    # 2. load sticker image
    sticker_dir = 'C:/Users/User/Desktop/big/blaind-proj/backend/mysite/model/stickers' # (도현다민) 이부분에 sticker 이미지 저장된 디렉토리 path 넣어주세요
    sticker = os.path.join(sticker_dir, sticker+'.webp')
    sticker = cv2.imread(sticker, cv2.IMREAD_UNCHANGED)
    
    count = 0
    

    # 3. return video
    out_file = src_dir+nickname+'/video'+"/Output.mp4"
    out = cv2.VideoWriter(out_file, cv2.VideoWriter_fourcc(*"mp4v"), cap.get(cv2.CAP_PROP_FPS),(w,h))
    
    # 4. selected face encoding
    selected_face_encodings  = []
    for i in range(0 , len(selected_face)):
        
        chose_image = fr.load_image_file(selected_face[i])
        chose_encoding = fr.face_encodings(chose_image, model='hog')[0]
        selected_face_encodings.append(chose_encoding)

    # 5. open video
    while cap.isOpened():
        ret,frame=cap.read()                           
        
        if ret == True:
            count=count+1
            frame1=frame[:, :, ::-1]                                    
            face_locations=fr.face_locations(frame1, model='hog')
            face_encodings=fr.face_encodings(frame,face_locations, model='hog')


            for j,face_encoding in enumerate(face_encodings):
            
                result=fr.compare_faces(selected_face_encodings,face_encoding,tolerance=0.54)
    
                # 6. sticker on face
                if not 1 in result : # If face found in the frame
                    f=face_locations[j]
                    print (f)
                    top, right, bottom, left = f[0],f[1],f[2],f[3]

                    overlay_img = sticker.copy()
                    overlay_img = cv2.resize(overlay_img, dsize=(right - left, bottom - top))
                    overlay_alpha = overlay_img[:, :, 3:4] / 255.0
                    background_alpha = 1.0 - overlay_alpha
                    frame[top:bottom, left:right] = overlay_alpha * overlay_img[:, :, :3] + background_alpha * frame[top:bottom, left:right]

                out.write(frame)

        else : 
            cap.release()

    # 7. close video
    out.release()
    cv2.destroyAllWindows()
    out_dir = out_file[:-11] + '/Output_encode.mp4'
    cv2.destroyAllWindows()
    os.system(f'ffmpeg -i {out_file} -vcodec libx264 {out_dir} -y')
    os.remove(out_file)

    return out_dir