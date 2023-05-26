import './Sign-up-enter.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

export default function SignUpEnter(){
  return(
  <div>
    <Header />
    <div className="signup-container">
        <p id="signup-header">기업 회원가입</p>
          <form className="user-input">
            <input type="text" placeholder='이메일*' id="signup-id" /><br/>
            <input type="text" placeholder='비밀번호*' id="signup-password" /><br/>
            <input type="text" placeholder='비밀번호 확인*' id="signup-password-again" /><br/>
            <input type="text" placeholder='이름*' id="signup-name" /><br/>
            <input type="text" placeholder='닉네임*' id="signup-nickname" /><br/>
            <form>
                <select name="purpose">
                    <option value="none">가입 목적</option>
                    <option value="youtube">개인 유튜브</option>
                    <option value="youtube2">기업 유튜브</option>
                    <option value="sns">개인SNS(인스타그램, 페이스북 등)</option>
                    <option value="sns2">기업SNS(인스타그램, 페이스북 등)</option>
                    <option value="youtube2">방송제작(예능, 뉴스 등)</option>
                    <option value="etc">기타</option>
                </select>
            </form>
            <Link to={"/Payment"}><button id="login-submit" type="submit">회원가입</button></Link>
          </form>
    </div>
    <Footer />
  </div>
  );
};