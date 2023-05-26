import './MyPage.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {Profiler, useEffect, useRef, useState, } from 'react';
import axios from 'axios';
import profileImg from '../../assets/image/default_user.jpg'


const MyPage = () => {

const [profileImage, setImg] = useState("");
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [nickname,setNickname] = useState("");
const [price, setPrice] = useState("");
const imageInput = useRef();
const token =  localStorage.getItem("refresh_token");

async function getProfileData(){   
    const formData = new FormData();
    formData.append("token", token);
    setImg(profileImg)
    axios({
        headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "http://127.0.0.1:8000/getprofile/",
          method: "POST",
          data: formData,
        }).then((response)=> {
        const {
            data: { email, username, nickname, profile_photo, price }
          } = response;
        setEmail(email);
        setName(username);
        setNickname(nickname);
        setImg(profile_photo);
        switch(price){
          case "Premium":
            setPrice("프리미엄"); break;
          case "Standard":
            setPrice("스탠다드"); break;
          default:
            setPrice("베이직"); break;
        }
})
}

const onClickProfileUpload = () => {
    imageInput.current.click();
}
const handleSubmit = (event) => {
    setImg(event.target.files[0]);
}

useEffect(()=>{
    getProfileData();
  },[])

const uploadProfileData = async (event) => {
    event.preventDefault();
    // 비밀번호와 비밀번호 확인란 비교.
    if (event.target.passwordNew.value !== event.target.passwordNew2.value){
      alert("비밀번호와 확인란이 서로 다릅니다!");
      return;
    }
  var formData = new FormData();
    formData.append("token", token);
    if(profileImage != profileImg)  formData.append("profile_photo", profileImage);
    formData.append("nickname", event.target.nickname.value);
    formData.append("password",event.target.passwordNew.value);
    
    try{
      axios({
          headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "http://127.0.0.1:8000/updateprofile/", // 파일 업로드 요청 URL
          method: "POST",
          data: formData,
        }).then(res => {
          const count = res.data.message.length;
          for(var i = 0; i < count; i++)
            alert(res.data.message[i]);
          alert("수정이 완료되었습니다.");
          window.location.replace("/mypage"); 
        })
    } catch(error){
      console.log(error);
    }
  }

  const onErrorImg = (e) => {
    e.target.src = profileImg;
  }
  return(
  <div>
    <Header />
    <div className="mypage-container">
        <p id="mypage-header">내 정보</p>
        <div>      
                    <img src={'http://127.0.0.1:8000'+profileImage} id="profile-img" alt = '대체이미지' onError={onErrorImg}></img><br/>
                    <button id='profile-button' onClick={onClickProfileUpload}>사진 선택</button>
                    <input type="file" accept="image/*" name="file" id="profile-file" style={{display:"none", height:"1px"}} ref={imageInput} onChange={handleSubmit} />
        </div>
        <form onSubmit={uploadProfileData}>
            <ul>
              <div className="info-field">
                    <label>이름</label>
                    <input type='text' placeholder={name} disabled style={{background:"rgb(224, 224, 224)"}}></input>
                </div>
                <div className="info-field">
                    <label>이메일</label>
                    <input type='text' placeholder={email} disabled style={{background:"rgb(224, 224, 224)"}}></input>
                </div>
                <div className="info-field">
                    <label>비밀번호</label>
                    <input id='passwordNew' type='password' placeholder='변경할 비밀번호를 입력하세요' ></input>
                </div>
                <div className="info-field">
                    <label>비밀번호 확인</label>
                    <input id='passwordNew2' type='password' placeholder='변경할 비밀번호를 재입력하세요' ></input>
                </div>
                <div className="info-field">
                    <label>닉네임</label>
                    <input type='text' id='nickname' placeholder={nickname}></input>
                </div>
                <div className="info-field">
                    <label>요금제</label>
                    <p id='price'>현재 {price} 요금제를 사용하고 있습니다.</p>
                </div>
            </ul>
            <button id='mypage-submit' type="submit">저장하기</button>
        </form>
    </div>
    <Footer />

  </div>
  );
};

export default MyPage;
