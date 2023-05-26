import './ResetPwd.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import axios from 'axios';
import {useState, useEffect} from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
export default function ResetPwd(){
  const [email, setEmail] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const get_email = location.pathname.split('/')[2]
  function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
  }

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/resetPassword/${get_email}/`)
    .then((response) => {
      setEmail(response.data.email);
      console.log(email);
    })
  .catch(function (error) {
      console.log(error);
    })

  }, []); // axios get 한 번만 실행되게 함.


  const ChangePassword = async (event) => {
    event.preventDefault();
    
    if (event.target.password.value !== event.target.password2.value){
      alert("비밀번호와 확인란이 서로 다릅니다!");
      return;
    }

    var formData = new FormData();
    formData.append('email', email);
    formData.append('password', event.target.password.value);

    axios({
      headers: {"Content-Type": "multipart/form-data",},
      url: "http://127.0.0.1:8000/resetPassword/",
      method: "POST",
      data: formData,
    })
    .then(response => {
      alert(response.data.message);
      navigate('/login');
    })
    .catch(error => {
      alert(error.response.data.message);
    });
  }
  return(
    <div>
    <Header />
    <div className="pwd-container">
        <p id="pwd-header">비밀번호 재설정</p>
        <p id="pwd-info">적용할 비밀번호와 확인란을 입력해주세요.</p>
          <form className="user-input" method="POST" onSubmit={ChangePassword}>
            <input type="password" placeholder='비밀번호' id="password" name='password'/>
            <br/>
            <input type="password" placeholder='비밀번호 확인' id="password2" name='password2'/>
            <br/>
            <button id="login-submit" type="submit">비밀번호 재설정</button>
          </form>
    </div>
    <Footer />
  </div>
  );
};