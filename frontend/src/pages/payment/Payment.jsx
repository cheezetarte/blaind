import "./Payment.css"
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import axios from "axios";

import payimg from "../../assets/image/payment_icon_yellow_medium.png"

export default function PayResult(){
  const [url,setUrl] = useState("");
  const location = useLocation();
  const plan = location.state.plan;
  async function goReady(){
    const params = {
        cid: "TC0ONETIME",
        partner_order_id: "partner_order_id",
        partner_user_id: "partner_user_id",
        item_name: "standard",
        quantity: 1,
        total_amount: 55000,
        vat_amount: 5000,
        tax_free_amount: 0,
        approval_url: "http://localhost:3000/payresult",
        fail_url: "http://localhost:3000/payresult",
        cancel_url: "http://localhost:3000/payresult",
    };
    
      await axios({
        // 프록시에 카카오 도메인을 설정했으므로 결제 준비 url만 주자
        url: "https://kapi.kakao.com/v1/payment/ready",
        // 결제 준비 API는 POST 메소드라고 한다.
        method: "POST",
        headers: {
          // 카카오 developers에 등록한 admin키를 헤더에 줘야 한다.
          Authorization: "KakaoAK e03003595bf64d73317d2358ab29cf0a",
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        // 설정한 매개변수들
        params,
      }).then((response) => {
        // 응답에서 필요한 data만 뽑는다.
        const {
          data: { next_redirect_pc_url, tid }
        } = response;
        window.localStorage.setItem("tid",tid);
        setUrl(next_redirect_pc_url);
        
      });
  }

  useEffect(()=>{
    goReady();
    console.log(url)
  },[])

   return(
          <div>
            <Header />
            <div className="payment-container">
                <p>결제</p>
                <div className="pay-info">
                  <h2>결제정보</h2>
                  <p style={{"fontWeight": "bold"}}>요금제</p>
                  <p>{plan}</p>
                  <p style={{"fontWeight": "bold"}}>결제금액</p>
                  <p>{plan==='standard'?'55,000원':'100,000원'}</p>
                </div>
                <div className="pay-kakao">
                      <div>
                      <p>카카오페이로 결제하기</p>
                      <a href={url}>
                      <img className="logo_img" alt="logo" src={payimg}/>
                      </a>
                      </div>
                </div>          
            </div>
            <Footer />
          </div>
          );
}