import './FindPwd.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import axios from 'axios';

export default function FindPwd(){
  const SendEmail = async (event) => {
    event.preventDefault();

    var formData = new FormData();
    formData.append('name', event.target.user_name.value);
    formData.append('email', event.target.user_email.value);
    axios({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: "http://127.0.0.1:8000/sendPasswordEmail/", // 비밀번호 재설정 메일 보내기 url
      method: "POST",
      data: formData,
    }).then(() => {
      alert("메일이 전송되었습니다.");
  }).catch(error => {
      alert(error.response.data.message);
    })
  }

  return(
    <div>
    <Header />
    <div className="pwd-container">
        <p id="pwd-header">비밀번호 찾기</p>
        <p id="pwd-info">가입 시 기입하신 이름과 이메일을 입력하면 비밀번호 재설정 링크를 메일로 보내드립니다</p>
          <form className="user-input" method="POST" onSubmit={SendEmail}>
            <input type="text" placeholder='이름' id="id" name='user_name'/>
            <br/>
            <input type="email" placeholder='이메일' id="password" name='user_email'/>
            <br/>
            <button id="login-submit" type="submit">메일 발송</button>
          </form>
    </div>
    <Footer />
  </div>
  );
};