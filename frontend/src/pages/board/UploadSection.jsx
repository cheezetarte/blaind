import './UploadSection.css';
import React, { useRef } from "react";
import axios from "axios";
const UploadSection = () => {
    const videoInput = useRef();

    const onClickUpload = () => {
        videoInput.current.click();
    }

    const handleSubmit = (event) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]); // formData에 file 담기.

        try{
            console.log(formData.values);
            axios({
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                url: "http://127.0.0.1:8000/upload/", // 파일 업로드 요청 URL
                method: "POST",
                data: formData,
              });
        } catch(error){
            console.log(error);
        }
    }
    return(
    <div>
        <form class="upload-section">
            <div id='file-text'>
                <p>여기에 파일을 놓으십시오.</p>
                <p>또는</p>
            </div>
            <input type="file" name="file" id="file" style={{display:"none"}} ref={videoInput} onChange={handleSubmit} />
            <button id="file-upload" type="button" onClick={onClickUpload}> 파일 추가 </button>
        </form>
    </div>
    );
}

export default UploadSection;