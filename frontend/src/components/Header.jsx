import './Header.css';
import logo from '../assets/image/logo.png';
import { Link } from "react-router-dom";
import {useState} from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function Header() {
    const [auth, setAuth] = useState('');
    useEffect(()=>{
        if(localStorage.getItem('access_token') !== null){
            setAuth(true)
        }
        else{
            setAuth(false)
        }
    },[])
    const handleLogout = () => {
        let token = localStorage.getItem('refresh_token');

        axios.post('http://127.0.0.1:8000/logout/', 
            {'token' : token })
        .then(res => {
            localStorage.clear();
            window.location.replace('/');
        });
    }

    return(
    <div>
        <div id="navigator">
            <Link to={'/'}><div><img className="logo_img" alt="logo" src={logo}/></div></Link>
            <nav className="nav">
                <Link to={"/intro"}><a className="nav-list">소개</a></Link>
                <Link to={"/qna"}><a className="nav-list">게시판</a></Link>
                <Link to={"/pricing"}><a className="nav-list">요금</a></Link>
            </nav>
            {
                auth
                ?
                <div className="sign">
                    <Link to={"/mypage"}><button id="sign-in" type="button" > 마이페이지 </button></Link>
                    <button id="sign-up" type="button" onClick={handleLogout}> 로그아웃 </button>
                </div>
                :
                <div className="sign">
                    <Link to={"/login"}><button id="sign-in" type="button" > 로그인 </button></Link>
                    <Link to={"/selectplan"}><button id="sign-up" type="button" > 무료 회원가입 </button></Link>
                 </div>
            }
        </div>
    </div>
    );
}

export default Header;