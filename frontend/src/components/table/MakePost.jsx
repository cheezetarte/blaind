import React from 'react';
import { Link } from 'react-router-dom';
import './MakePost.css';
import axios from 'axios'
const VocHeader = props => {
//   const { headersName, children } = props;

  return (
    <div className="voc-container">
        <Link to='./makepost'>
            <button className="voc-header" >게시글 작성</button>
        </Link>
    </div>
  )
}

export default VocHeader;