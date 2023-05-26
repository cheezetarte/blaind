import './StartForFree.css';
import starfree from '../assets/image/starfree.jpg'
import { Link } from "react-router-dom";

const StartForFree = () =>{
    return(

    <div className="jb-wrap">
    <div className="jb-image"><img src={starfree} alt="" /></div>
    <div className="jb-text">
        <div className="jb-text-table">
            <div className="jb-text-table-row">
                <div className="jb-text-table-cell">
                    <p id = 'buttontext'>회 원 가 입 후 모 든 기 능 을 무 료 로 체 험 해 보 세 요!</p>
                    <Link to={"/login"}><button className="newbtn">무료로 시작하기</button></Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}


export default StartForFree
