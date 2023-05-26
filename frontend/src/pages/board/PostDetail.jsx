import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PostDetail.css';
import { useLocation } from 'react-router-dom';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Comments from "../../components/table/Comment";
import { Link } from 'react-router-dom';


function GetData(vocId) {
  const [question, setQuestion] = useState({});
  const location = useLocation();
  const temp_path = location.pathname.split('/')[1]
  var chk_array = JSON.stringify(location.pathname)+'/'
  chk_array = chk_array.replaceAll("\"", "");
  const real_path = '/'+temp_path
  var modif_path = location.pathname+'/detail'
  const Nochul_title=temp_path
  useEffect(() => {
    axios.get('http://127.0.0.1:8000'+chk_array).then((response)=> {
        setQuestion(response.data)
        console.log(response.data)
        
        //  json 파일에서 post_id를 기반으로 인덱싱을 진행
        // filter_id에서 -1을 해준 이유는 response.data[]<- 여기에 있는 []가 0에서부터 시작하고,
        // 배열의 순서를 기반으로 indexing을 해줬기 떄문이다.
    })
  }, []);

  const item =  (
    <>
        <Header></Header>
        <h1 className='type_h1' style = {{color: 'white'}}>게시판 상세보기</h1>
        <section class="article-detail table-common con row" style = {{backgroundColor: 'white'}} >
        <table class="cell" border="1">
            <colgroup>
                <col width="100px" />
            </colgroup>
            <tbody>
                <tr class="article-title">
                  <th>제목</th>
                  <td >{question.title}</td>
                </tr>
                <tr class="article-info">
                    <th>작성자</th>
                    <td>{question.writer}</td>
                    <th>조회수</th>
                    <td>{question.writer}</td>
                    <th>날짜</th>
                    <td>{question.updatedate}</td>
                </tr>
                <tr class="article-body">
                    <td colspan="12" className='content-body'>{question.content}</td>
                </tr>
            </tbody>
        </table>
    </section>


        <hr className='lineTag'></hr>
            <Comments></Comments>

        <Footer></Footer>

    </>
  )

    return item;
}

function VocView() {
  const{vocId} = useParams();
  const item = GetData(vocId);

  return (<>
    <div>
        {item}
    </div>
  </>);
}
  
export default VocView;