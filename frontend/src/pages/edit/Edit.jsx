import './Edit.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {useState, } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from 'react-player/lazy';
import { useEffect } from 'react';
import Loading from './Loading';
import quokka from './Quokka.webp'
import man from './man.png';

export default function Edit(){
  const location = useLocation();
  const [video_path, setVideoPath] = useState(location.state.video_path);
  const [face_loading, setFaceLoading] = useState(true);
  const [video_loading, setVideoLoading] = useState(false);
  const [img_list, setImgList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedList, setSelectedList] = useState([]);
  const [nickname, setNickname] = useState("");
  const [blur_type, setBlurType] = useState("none");
  const [blur_sigma, setBlurSigma] = useState("");
  const [edit_url,setUrl] = useState("");
  const [sticker, setSticker] = useState("");
  const token =  localStorage.getItem("refresh_token");

  const handleBlurType = (e) => {
    setBlurType(e.target.value);
  };
  async function getProfileData(){   
    const formData = new FormData();
    formData.append("token", token);
    axios({
        headers: {
            "Content-Type": "multipart/form-data",
          },
          url: "http://127.0.0.1:8000/getprofile/", // 파일 업로드 요청 URL
          method: "POST",
          data: formData,
        }).then((response)=> {
        const {
            data: { nickname }
          } = response;
        setNickname(nickname);
})
}
const handleBlurSigma = (e) =>{
  setBlurSigma(e.target.value);
  setUrl("http://127.0.0.1:8000/getVideo/");
}
  async function getFace(formData){
    await axios({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: "http://127.0.0.1:8000/facelist/", // 파일 업로드 요청 URL
      method: "POST",
      data: formData,
    }).then((response) => {
      // 응답에서 필요한 data만 뽑는다.
      const {
        data: { image_list }
      } = response; 
      setImgList(image_list);  
      console.log(image_list);
      setFaceLoading(false);
  });
  }
  const handleStickerType = (e) =>{
    setSticker(e.target.value);
    setUrl("http://127.0.0.1:8000/stickerVideo/");
  }
  function checkBoxHandler(event){
    if(!selectedList.includes(event.target.value)){
      selectedList.push(event.target.value);
    }else{
      const minusList = selectedList.filter((val) => {
          if(val !== event.target.value){
            return val;
          }
      })
      setSelectedList(minusList);
    }
  }

  async function getVideo(){
    console.log(sticker)
    console.log(edit_url);
    if(blur_type==='none'){
      alert('모자이크 유형을 선택하세요')
    }
    else
    {
      setVideoLoading(true);
      const formData = new FormData();
      formData.append('selected_face', selectedList);
      formData.append('video_path', video_path);
      formData.append('nickname', nickname);
      if(blur_type==='blur'){
        formData.append('sigma', blur_sigma);
      }
      else{
        formData.append('sticker', sticker);
      }
      await axios({
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: edit_url, // 파일 업로드 요청 URL
        method: "POST",
        data: formData,
      }).then((response) => {
        // 응답에서 필요한 data만 뽑는다.
        const {
          data: { edited_video }
        } = response; 
        setVideoPath("http://127.0.0.1:8000/"+edited_video.slice(53,));
        setVideoLoading(false);
      });
    }
  }
  
  useEffect(()=>{
    const formData = new FormData();
    getProfileData();
    formData.append("token", localStorage.getItem("refresh_token"));
    formData.append('video_path', video_path);
    getFace(formData);
  },[])
  
  function youtube() {
    window.open('http://localhost:3000/youtube', 'popup', 'width=650,height=420');
  }
  return(
  <div>
    <Header />
    <div className="share-video">
    <button onClick={youtube}>공유하기</button>
      <button>다운로드</button>
    </div>
        <div className='edit-container'>
          <div className='edit-select'>
            <div className='face-container'>
              <h2>제외할 대상 선택</h2>
              <div className='face-list'>
                {       face_loading ? <Loading />
                        :img_list.map(function(img, index){
                          return <div>
                            {/* 본인 경로 맞게 수정, mysite/media까지의 경로 길이 slice 뒤에 써주면 됨
                            ex. 나는 경로=[C:/Users/User/Desktop/big/blaind-proj/backend/mysite/media/]라서 53임 */}
                            <img className="detected_face" src={"http://127.0.0.1:8000/"+img.slice(53,)}/>
                            <input name='selected_face[]' value={index} type='checkbox' onChange={checkBoxHandler}></input>
                            </div>
                        }
                        )   
                }
              </div>
            </div>
            <div className='blur-type'>
            <select id="blur-type" name="blur-type" onChange={handleBlurType} >
                  <option value="none">모자이크 유형</option>
                  <option value="blur">블러</option>
                  <option value="sticker">스티커</option>
              </select><br></br>
              {
                  blur_type === 'none'
                  ? <div></div>
                  :(blur_type === 'blur'
                  ?<select id="blur-type" name="blur-type" onChange={handleBlurSigma} >
                  <option value="none">종류</option>
                  <option value="100">강하게</option>
                  <option value="1">약하게</option>
                  </select>
                  :<div>
                  <img id='sticker' src={quokka} alt='쿼카'/>
                  <img id='sticker' src={man} alt='초록모자' onChange={handleStickerType}/>
                  <br></br>
                  <input id='sticker-type' name='sticker_type' type='radio' value='quokka' onChange={handleStickerType}></input>
                  <input id='sticker-type' name='sticker_type' type='radio' value='man' onChange={handleStickerType}></input>
                  </div>)
              }
              <br></br>
              <button id="send-blurtype" onClick={getVideo}>적용하기</button>
            </div>
          </div>
          <div className='player-container'>
            {
              video_loading?
              <Loading />
            :<ReactPlayer
                className='player'
                url={video_path}
                width="800px"
                height="500px"
                playing={true}
                muted={true}
                controls={true}
                light={false}
                pip={true}
          />
            }
          </div>
        </div>
    <Footer />
  </div>
  );
};

