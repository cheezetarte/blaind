import './UploadSection.css';
import React, {useCallback, useEffect, useRef, useState,} from "react";
import axios from "axios";

import {useNavigate} from 'react-router-dom'
import {useDropzone} from 'react-dropzone'


const UploadSection = () => {
    
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const formData = new FormData();
        formData.append("token", localStorage.getItem("refresh_token"));
        formData.append("file", acceptedFiles[0]); // formData에 file 담기.
        sendVideo(formData)
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    const videoInput = useRef();
    const navigate = useNavigate();
    const urlRef = useRef({video_path:''});

    async function sendVideo(formData){
        try{
            console.log(formData.values);
            await axios({
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                url: "http://127.0.0.1:8000/upload/", // 파일 업로드 요청 URL
                method: "POST",
                data: formData,
              }).then((response) => {
                // 응답에서 필요한 data만 뽑는다.
                const {
                  data: { video_path }
                } = response;            
                urlRef.current = {video_path};
                console.log(video_path);
                console.log(urlRef.current.video_path)
                navigate("/edit", {state:{'video_path': "http://localhost:8000"+urlRef.current.video_path}}); // video path(도현)
            });
                
        } catch(error){
            if(error.response.data.message != undefined)
                alert(error.response.data.message);
            
            else
            window.alert('로그인이 안되어있거나, 해당 요금제에서 사용하시는 것이 불가능합니다.');
        }
    }

    const handleSubmit = (event) => {
        const formData = new FormData();
        formData.append("token", localStorage.getItem("refresh_token"));
        formData.append("file", event.target.files[0]); // formData에 file 담기.
        sendVideo(formData);
    }
    
    const onClickUpload = () => {
        videoInput.current.click();
    }

    return(
    <div>
        <div className="upload-section">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <div>
                        <p id='file-text'>파일을 놓으세요</p>
                        <p id='file-text'>(mp4, 어쩌고, 저쩌고만 지원됩니다..)</p>
                    </div> :
                    <div>
                        <p id='file-text'>여기에 파일을 놓으세요</p>
                        <p id='file-text'>또는</p>
                    </div>
                }
            </div>
            <div>
                <button id="file-upload" type="button" onClick={onClickUpload}> 비디오 추가 </button>
                <input type="file" accept="video/*" name="file" id="file" style={{display:"none", height:"1px"}} ref={videoInput} onChange={handleSubmit} />
            </div>
        </div>
    </div>
    
    );
};
export default UploadSection;