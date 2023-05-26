import './Sign-up.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {useState, } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";

export default function SignUp(){
  const [checkmail, setCheckmail] = useState(null);
  const [checknick, setChecknick] = useState(null);  
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.pathname.split("/")[2];

  const userType = (plan ==='basic')?'personal':'enterprise'

  const navigateToPage = () => {
    plan==='basic'? navigate("/welcome"):navigate("/payment", {state:{'plan':plan}});
  };
  function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}
  const VerifyEmail = async (event) => {
    event.preventDefault();
    axios.post("http://127.0.0.1:8000/sendEmail/",
    {
      "email" : document.getElementById("signup-id").value,
    }).then(() => {
      alert("입력한 이메일로 인증 메일을 보냈습니다. 메일함을 확인해주세요.");
    }).catch(() => {
      alert("해당 이메일은 이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.");
    });
  }

  const uploadSignData = async (event) => {
    event.preventDefault();
    // 비밀번호와 비밀번호 확인란 비교.
    if (event.target.password.value !== event.target.password2.value){
      alert("비밀번호와 확인란이 서로 다릅니다!");
      return;
    }

    var formData = new FormData();;
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    formData.append("username", event.target.name.value);
    formData.append("nickname", event.target.nickname.value);
    formData.append("purpose", event.target.purpose.value);
    formData.append("user_type", userType);
    formData.append("price", plan);
    

      axios({
          headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "http://127.0.0.1:8000/signup/", // 파일 업로드 요청 URL
          method: "POST",
          data: formData,
        }).then(() => {
          wait(1);
          navigateToPage();
        }).catch(error => {
          const message = error.response.data.message;
                    console.log(error.response.data);
          switch(message){
            case "중복":
              setCheckmail(error.response.data.email);
              setChecknick(error.response.data.nickname);
              break;
            case "password":
              alert("유효하지 않은 비밀번호 입니다.\n비밀번호는 8자 이상, 숫자, 문자, 특수 문자 1자 이상이어야 합니다.");
              break;
            case "admin_nickname":
              alert("해당 닉네임을 사용할 수 없습니다.\n관리자로 추측될 수 있는 닉네임은 사용이 불가합니다.");
              break;
            default:
              alert(error.response.data.message);
              break;
          }
        });
  }
  return(
  <div>
    <Header />
    <div className="signup-container">
        <p id="signup-header">회원가입</p>
          <form className="user-input" onSubmit={uploadSignData}>
            <div id='id-container'>
              <input type="text" placeholder='이메일*' id="signup-id" name="email"/>
              <button id="id-verify" onClick={VerifyEmail}>인증</button>
              <div className = 'jungbok'>
                {
                  checkmail === true
                  ? <p className = 'caution'>⚠ 이미 등록된 이메일입니다. ⚠</p>:<p></p>
                }
              </div>
            </div>
            <input type="password" placeholder='비밀번호*' id="signup-password" name="password"/><br/>
            <input type="password" placeholder='비밀번호 확인*' id="signup-password-again" name="password2"/><br/>
            <input type="text" placeholder='이름*' id="signup-name" name="name"/><br/>
            <input type="text" placeholder='닉네임*' id="signup-nickname" name="nickname"/><br/>
            <div className = 'jungbok'>
                {
                  checknick === true
                  ? <p className = 'caution'>⚠ 이미 등록된 닉네임입니다. ⚠</p>:<p></p>
                }
            </div>
              <select name="purpose" >
                  <option value="none">가입 목적</option>
                  <option value="youtube-personal">개인 유튜브</option>
                  <option value="youtube-enter">기업 유튜브</option>
                  <option value="sns-personal">개인SNS(인스타그램, 페이스북 등)</option>
                  <option value="sns-entLOCer">기업SNS(인스타그램, 페이스북 등)</option>
                  <option value="broad">방송제작(예능, 뉴스 등)</option>
                  <option value="etc">기타</option>
              </select>
            <div>
            <button id="login-submit" type="submit">회원가입</button>
            </div>
          </form>
    </div>
    <Footer />

  </div>
  );
};

