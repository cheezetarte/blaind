import './Welcome.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Welcome(){
  
  return(
  <div>
    <Header />
    <div className='welcome-container'>
        <p style={{'font-size':'40px'}}>블라인드에 오신걸 환영합니다!</p>
        <div style={{'margin-bottom':'70px'}}>
            <h3>가입하신 이메일로 인증 링크가 발송되었습니다</h3>
            <h3>이메일 인증을 완료하시고 블라인드의 기능을 즐겨보세요</h3>
        </div>
        <Link to={"/login"}><button id='goto-login'>로그인 하러 가기</button></Link>
    </div>
    <Footer />
  </div>
  );
};
