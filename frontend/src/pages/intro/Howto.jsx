import './Howto.css';
import step1 from "../../assets/image/howtouseblaind.mp4"
const Howto = () =>{
    return(
    <div class="Howto-container">
        <div class="Howto-header">
            <p>BL</p><p  style={{color: "#E74949"}}>AI</p><p>ND</p>
            <p>를 사용하는 방법</p>
        </div>
        <div class="Howto-content">
            <div>
            <video src={step1} type="video/mp4" oncontextmenu="return false;" id="step1" width="640" controls autoplay>
            </video>
                <h1>1</h1>
                <h2>회원가입 및 로그인</h2>
                <p>개인 이용자는 회원가입 후 무료로 이용이 가능하며,</p>
                <p>기업 및 단체는 월정액 결제 후 라이센스를 편하게 이용하세요.</p>
            </div>
            <div>
                <h1>2</h1>
                <h2>파일 추가</h2>
                <p>AI를 활용하여 모자이크를 추가하고싶다면, 파일 추가를 클릭하세요</p>
            </div>
            <div>
                <h1>3</h1>
                <h2>인물 선택</h2>
                <p>영상에서 인식된 인물 중 모자이크에서 제외할 대상을 선택하세요</p>
            </div>
            <div>
                <h1>4</h1>
                <h2>모자이크 설정 선택 및 적용</h2>
                <p>원하는 모자이크를 설정하고 적용하세요</p>
            </div>
            <div>
                <h1>5</h1>
                <h2>저장하기 & 공유하기</h2>
                <p>모자이크가 적용된 영상을 저장하고 SNS에 공유하세요</p>
            </div>
        </div>
    </div>
    );
}

export default Howto;