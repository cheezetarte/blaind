import React from 'react';
 import { Navigate } from 'react-router-dom';

 function PublicRoute({ component: Component }) {
   return (
    localStorage.getItem('access_token') !== null ?  <Navigate to='/' {...alert("비정상적인 접근입니다. \n메인페이지로 돌아갑니다.")} /> :Component
   )
 }

 export default PublicRoute