// 새로운 content 추가하는 code
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import './makeboardcomp.css';
import {useCallback, useEffect, useState} from "react";
import { useParams} from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";


const EditBoard = () => {
    const URL = 'http://127.0.0.1:8000'
    // URI 파라미터 가져오기
    const {post_id} = useParams();
    // 게시판 제목, 내용, 사진
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const location = useLocation();
    var chk_array =  location.pathname.slice(0,-6)
    const loc = chk_array.split('/')[1]
    useEffect(() => {
    const getBoard = async () => {
        const {data} = await axios.get(URL + chk_array);
        return data;
        }
        getBoard().then((result) => {
            setTitle(result.title);
            setContent(result.content);
          });
        }, [])

    const handleSubmit = useCallback(async () => {
        var getTitle = document.getElementById("title").value;
        var getContent = document.getElementById("content").value;  
        const tmpchk_array = 'http://127.0.0.1:8000'+ location.pathname.slice(0,-6)
        console.log('tmpchk_array : ' + tmpchk_array)
        console.log(getTitle)
        console.log(getContent)
        const PostData = {
          "title": getTitle,
          "content": getContent,
      };
        axios.put(tmpchk_array, PostData)
          .then(function (response) {
            console.log(response);
          })
          .catch((error) => console.log( error.response.request._response ) );
        window.alert("😎수정이 완료되었습니다😎");
        // 이전 페이지로 돌아가기
        window.location.href = 'http://127.0.0.1:3000/qna'
    }, []);


    return(
<div>
<Header></Header>
<div class = 'layout'>
  <div className = 'TitleArea'>
    <p className= 'location_title'>{loc}</p>
    <p className= 'location_title'> | </p>
    <input id = 'title' type="text" defaultValue={title}></input>
    <div className="submitButton">
    <button onClick={handleSubmit} className="post" variant="outlined">
    수정</button>
    </div>
  </div>
  <div className = 'ContentArea'>
    <textarea id = 'content' cols="50" rows="10" defaultValue = {content}></textarea>
  </div>
  </div>
<Footer />
</div>
    )
            }

export default EditBoard;