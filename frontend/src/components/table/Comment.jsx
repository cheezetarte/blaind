import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './Comment.css'
import profileImg from '../../assets/image/default_user.jpg'

const CommentInput = ({ onInsert }) => {
    const [content, setContent] = useState(null);
    const location = useLocation();
    const [post_id,setPostID] = useState(1)
    const [text, setText] = useState([]);
    const [lists, setLists] = useState([]);
    const [image,setImage] = useState([])
    const chk_array = 'http://127.0.0.1:8000'+location.pathname+'/reply/'
    console.log(chk_array)

    const onErrorImg = (e) => {
        e.target.src = profileImg;
      }
    useEffect(()=>{
        axios.get(chk_array).then((response) => {
            console.log(response.data);
            setText([...response.data]);
            setLists(response.data)
        })
        .catch(function (error) {
            console.log(error);
          })
    },[]);

    const onChangeContent = (e) => {
        setContent(e.target.value);
    }


    const onSubmit = () => {
        console.log(chk_array)
        var token = localStorage.getItem('refresh_token');
        if(localStorage.getItem('access_token')) {
            var formData = new FormData();
            formData.append("token", token);
            formData.append("content", content);
            axios.post(chk_array,{
                'post_id': post_id,
                'token' : token,
                'content' : content
            })
            // window.alert('댓글이 작성되었습니다.')
        }
        else{
            return(
                <Navigate to= '/'{...alert("로그인이 되어있지 않으면 댓글기능을 사용하실수 없습니다.")} />

            )

        }

    }
    return (
        <div>
        <section className="mb-5">
            <div className="card bg-light">
                <div className="card-body">
                    <form className="mb-4" onSubmit={onSubmit}><textarea placeholder="댓글" className='form-control' onChange={onChangeContent} />
                    <button type="submit">작성</button></form>
                    {text.map((e) => (
                    <div className="d-flex mb-4">
                        <div className="flex-shrink-0"><img className="rounded-circle" 
                        img src={'http://127.0.0.1:8000'+'/abc'}
                        alt="..." onError={onErrorImg}/></div>
                        <div className="ms-3">
                            <div className="fw-bold">{e.writer}</div>
                            <div className = 'fw-content'>{e.content}</div>
                        </div>
                    </div>
                    ))}

                </div>
            </div>
        </section>
        </div>
    )
}

export default CommentInput;