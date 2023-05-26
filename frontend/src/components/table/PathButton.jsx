import React from "react";
import './PathButton.css'
import { Link } from "react-router-dom";

 
export function BoardButton() {
    return (
        <div style = {{textAlign:"Center"}}>
            <Link to={"/notice"}><button className="Axios_Btn"> 공지사항 </button></Link>
            <Link to={"/qna"}><button className="Axios_Btn"> Q n A </button></Link>
            <Link to={"/example"}><button className="Axios_Btn"> 적용사례 </button></Link>
        </div>
    );
}

export default BoardButton;