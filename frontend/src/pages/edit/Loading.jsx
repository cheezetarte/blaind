import React from 'react';
import Spinner from './Spin.gif';

export default function Loading(){
  return (
    <div>
      <img src={Spinner} alt="로딩중" width="30%" />
      <h4>잠시만 기다려 주세요.</h4>
    </div>
  );
};