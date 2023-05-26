import './Reason.css';
import brain from "../../assets/image/brain.png"
import editing from "../../assets/image/editing.png"
import share from "../../assets/image/share.png"
import time from "../../assets/image/time-is-money.png"
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

const Reason = () =>{
    return(
    <div className="Reason-container">
        <div className="Reason-header">
            <Fade>
                <p>왜</p>
                <p>BL</p><p  style={{color: "#E74949"}}>AI</p><p>ND</p>
                <p>를 사용할까요?</p>
            </Fade>
        </div>
        <div className="Reason-content">
            <div className= "Reason-col">
                <Zoom>
                <div className="Reason-list">
                        <img className="Reason-img" alt="editing" src={editing}/>
                        <p>간편한 모자이크</p>        
                </div>
                </Zoom>
                <Zoom>
                <div className="Reason-list">
                        <img className="Reason-img" alt="brain" src={brain}/>
                        <p>똑똑한 인물 구분</p>
                </div>
                </Zoom>
            </div>
            <div className= "Reason-col">
                <Zoom>
                <div className="Reason-list">
                        <img className="Reason-img" alt="share" src={share}/>
                        <p>쉽고 빠른 공유</p>
                </div>
                </Zoom>
                <Zoom>
                <div className="Reason-list">
                    <img className="Reason-img" alt="time" src={time}/>
                    <p>비용과 시간 절약</p>
                </div>
                </Zoom>
            </div>
        </div>
    </div>
    );
}

export default Reason;