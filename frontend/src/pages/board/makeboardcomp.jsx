import axios from 'axios';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import './makeboardcomp.css';

const PostMake = () => {
  const navigate = useNavigate();
  const user_id = useRef(0);
  const is_staff = useRef(false);
  const location = useLocation();
  const return_path = location.pathname.slice(0,-8)
  const Nochul_title= return_path.slice(1,-1)

  useEffect(() => {  
    axios.post('http://127.0.0.1:8000/verifyToken/',
    {'access_token':localStorage.getItem('access_token'),
    'refresh_token': localStorage.getItem('refresh_token')})
    .then(res => {
      console.log(res.data);
      is_staff.current = res.data.is_staff;
      user_id.current = res.data.user_id;
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);

      // 관리자만 작성 가능한 게시판일 경우 + 관리자가 아닐 경우
      if((return_path.includes('example') || return_path.includes('notice'))
      && is_staff.current==false){ 
        alert("관리자만 작성 가능한 게시판입니다.");
        navigate(return_path);
      }
    })
    .catch(error => {
      alert(error.response.data.message);
      navigate("/");
    });
  }, []);

  function TextInput() {
    var getTitle = document.getElementById("title").value;
    var getContent = document.getElementById("content").value;  
    const chk_array = 'http://127.0.0.1:8000'+location.pathname.slice(0,-8)
    console.log("user_id.current : ", user_id.current);
    axios.post(chk_array, {
      "user_id" : user_id.current,
      "title": getTitle,
      "content": getContent,
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      window.alert("게시판이 작성되었습니다");
      <Link to= {return_path}></Link>
}

    return(
      <>
      <Header></Header>
      <div class = 'layout'>
        <div className = 'TitleArea'>
          <p className= 'location_title'>{Nochul_title}</p>
          <p className= 'location_title'> | </p>
          <input id = 'title' className = 'titleText' name="title" type="text" placeholder='여기에 제목을 적어주세요..'></input>
          <Link to = {return_path}><button type="button" className="post" onClick={TextInput}>
          등록
        </button></Link>
        </div>
        <div className = 'ContentArea'>
          <textarea id = 'content' className = 'Content' name="content" placeholder = '여기에 내용을 적어주세요..'></textarea>
        </div>
        </div>
      <Footer />
      </>
    )
}

  
export default PostMake;