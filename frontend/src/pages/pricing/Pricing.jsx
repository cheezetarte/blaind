import "./Pricing.css"
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Fade from 'react-reveal/Fade';

export default function Pricing(){
  return(
  <div>
    <Header />
    <div className="pricing-container">
      <div className="pricing-header">
        <p>BL</p><p  style={{color: "#E74949"}}>AI</p><p>ND</p>
        <p>의 멤버십 플랜</p>
        <br></br>
      </div>
      <div className="pricing-explain">
        <div>무료로 시작할 수 있는 개인 요금제부터 라이센스를 사용할 수 있는 프리미엄 요금제까지</div>
        <p>용도에 따라 나에게 맞는 요금제를 사용해보세요.</p>
      </div>
      <div className="pricing-table">
        <div className="pricing">
          <Fade>
            <div className="pricing-name">베이직</div>
            <hr></hr>
            <h2>개인용 무료 요금제</h2>
            <br></br><br></br>
            <p style={{color:"#E74949", "text-shadow":"1px 1px 1px rgb(29, 29, 29)"}}>무료</p>
            <p>최대 60분</p>
            <p>720p의 화질</p>
            <p>라이센스 이용 불가</p>
          </Fade>
        </div>
        <div className="pricing">
          <Fade>
            <div className="pricing-name">스탠다드</div>
            <hr></hr>
            <h2>기업용 라이센스 요금제</h2>
            <br></br><br></br>
            <p style>월 55,000원</p>
            <p>최대 6시간</p>
            <p>1440p의 화질</p>
            <p style>라이센스 이용 가능</p>
          </Fade>
        </div>
        <div className="pricing">
          <Fade>
            <div className="pricing-name">프리미엄</div>
            <hr></hr>
            <h2>기업용 라이센스 요금제</h2>
            <br></br><br></br>
            <p style>월 100,000원</p>
            <p>최대 12시간</p>
            <p>2560p의 화질</p>
            <p style>라이센스 이용 가능</p>
          </Fade>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};