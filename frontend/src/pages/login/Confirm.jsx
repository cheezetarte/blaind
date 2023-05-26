import axios from 'axios';
import {useState, useEffect} from 'react';
import { useNavigate, useParams } from "react-router-dom";
export default function Comfirm() {
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const get_email = params.email;
        console.log(get_email);
        axios.get(`http://127.0.0.1:8000/confirmEmail/${get_email}/`)
        .then(response => {
            navigate(`/resetPwd/${response.data.email}`);
        }).catch(error => {
            alert(error);
//            window.close();
        });
    }, []);
    return(
        <div></div>
    );
}