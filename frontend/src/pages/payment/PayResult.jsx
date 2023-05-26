
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useParams, useLocation } from "react-router-dom";

import React from "react";
import axios from "axios";
import { useEffect } from 'react';

export default function PayResult(){
  const getParam = (code) => {
    return new URL(window.location.href).searchParams.get(code);
  };

  const sendToKakao = (params) => {
        axios({
      url: "https://kapi.kakao.com/v1/payment/approve",
      method: "POST",
      headers: {
        Authorization: "KakaoAK e03003595bf64d73317d2358ab29cf0a",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params,
    }).then((response) => {
      // 결제 승인에 대한 응답 출력
      console.log(response);
    });

  }

  useEffect(()=>{
    const state = {
      cid: "TC0ONETIME",
      // localstorage에서 tid값을 읽어온다.
      tid: window.localStorage.getItem("tid"),
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      pg_token: getParam("pg_token"),
  }
  
  sendToKakao(state);  

  },[])

  return (
    <div>
      <Header />
      <div className='welcome-container'>
        <p style={{'font-size':'40px'}}>블라인드에 오신걸 환영합니다!</p>
        <div style={{'margin-bottom':'70px'}}>
            <p>이제 블라인드의 기능을 사용해보세요</p>
            <p>어쩌고저쩌고..입니다</p>
        </div>
        <button id='goto-login'>로그인 하러 가기</button>
      </div>
      <Footer />
    </div>
  );
}