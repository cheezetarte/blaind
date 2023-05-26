import React, {useEffect, useState} from 'react';
import CommonTable from '../../components/table/CommonTable';
import CommonTableRow from '../../components/table/CommonTableRow';
import CommonTableColumn from '../../components/table/CommonTableColumn';
import '../../components/table/Search.css'
import './PostList.css';
import axios from "axios";
import { Link} from "react-router-dom";
import MakePost from '../../components/table/MakePost';

const NoticeList = props => {
  const [text, setText] = useState([]);
  const [search, setSearch] = useState("");
  const [lists, setLists] = useState([]);


  useEffect(() => {
    // package.json 참고! proxy로 가지고옴
    // 마지막에 반드시 슬래쉬를 넣어줘야함
    axios.get("http://127.0.0.1:8000/notice/").then((response) => {
      setText([...response.data]);
      setLists(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
  }, []); // axios get 한 번만 실행되게 함.

  const onSearch = (e) => {
    e.preventDefault();
    if (search === null || search === '') { //검색어가 없을 경우 전체 리스트 반환
      axios.get("http://127.0.0.1:8000/notice/")
        .then((res) => {
          setText([...res.data]);
        });
    } else { //검색 구현
      const filterData = lists.filter((row) => row.title.includes(search))
      setText(filterData)
    }
    setSearch('')
  }
  const onChangeSearch = (e) => {
    e.preventDefault();
    console.log(e)
    setSearch(e.target.value);
  };

  return (
    <div>
      <CommonTable headersName={['No.', '제목', '등록일', '조회수']}>
      {text.map((e) => (
        <CommonTableColumn>
          <CommonTableRow><Link to={`${e.post_id}`} style = {{color :'white'}}>{e.post_id}</Link></CommonTableRow>
          <CommonTableRow><Link to={`${e.post_id}`} style = {{color :'white'}}>{e.title}</Link></CommonTableRow>
          <CommonTableRow><Link to={`${e.post_id}`} style = {{color :'white'}}>{e.regdate}</Link></CommonTableRow>
          <CommonTableRow><Link to={`${e.post_id}`} style = {{color :'white'}}>{e.read_cnt}</Link></CommonTableRow>
        </CommonTableColumn>
        
      ))}
      </CommonTable>
      <MakePost></MakePost>
      <form onSubmit={e => onSearch(e)} className = 'SearchComp'>
        <input type="text" value = {search} placeholder="Text Title.." onChange={onChangeSearch} className="SearchText" />
        <button className="SearchButton">검 색</button>
      </form>
    </div>
  )
}

export default NoticeList;