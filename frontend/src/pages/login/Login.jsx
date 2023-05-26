import './Login.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const navigate = useNavigate();
  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      console.log('Enter Pressed!!')
    }
  }
  const uploadSignData = async (event) => {
    event.preventDefault();

    var formData = new FormData();
    formData.append("email", event.target.user_email.value);
    formData.append("password", event.target.password.value);
    
    try{
      axios({
          headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "http://127.0.0.1:8000/login/", // 파일 업로드 요청 URL
          method: "POST",
          data: formData,
        }).then(res => {
          console.log(res.headers);
          localStorage.setItem('access_token', res.data.jwt_token.access_token);
          localStorage.setItem('refresh_token', res.data.jwt_token.refresh_token);
          navigate("/");
        }).catch(error => {
          alert(error.response.data.message);
        })
  } catch(error){
      console.log(error);
  }
  }

  return(
  <div>
    <Header />
    <div className="login-container">
        <p id="login-header">로그인</p>
          <form className="user-input" method="POST" onSubmit={uploadSignData} onKeyDown={(e)=>onCheckEnter(e)}>
            <input type="email" placeholder='이메일' id="id" name='user_email'/>
            <br/>
            <input type="password" placeholder='비밀번호' id="password" name='password'/>
            <br/>
            <button id="login-submit" type="submit">로그인</button>
            <div className='guitar'>
              <p id = 'isthere'style={{display:"inline"}}>계정이 없으신가요?</p>
              <Link to={"/sign-up"}><button id="login-sign-up">회원가입</button></Link>
            </div>
            <div className='guitar'>
              <p id = 'isthere'style={{display:"inline"}}>비밀번호를 잊으셨나요?</p>
              <Link to={"/findpwd"}><button id="find-password">비밀번호 찾기</button></Link>
            </div>
          </form>
    </div>
    <Footer />
  </div>
  );
};
