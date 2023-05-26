import Footer from '../../components/Footer';
import Header from '../../components/Header';
import axios from 'axios';
import Loading from './Loading';
import { useState } from 'react';
export default function Youtube() {
  const [load, setLoad] = useState(false);

  console.log(load);
    const UploadFile = (event) => {
      event.preventDefault();

      var formData = new FormData();
      formData.append('title', event.target.title.value);
      formData.append('description', event.target.description.value);
      setLoad(true)
      axios({
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: "http://127.0.0.1:8000/youtube/",
        method: "POST",
        data: formData,
      }).then(res => {
        alert("업로드를 완료하였습니다!.");
        window.close();
      }
      )
      .catch(error => {
        console.log(error);
      });
    }
    
    return(
        <div>
          <div className="signup-container">
              <p id="signup-header">Youtube</p>
                {
                  !load ? <form onSubmit={UploadFile}>
                  <div>
                    <input type="text" placeholder='영상의 제목을 적어주세요.' id="title" name="title" />
                  </div>
                  <div>
                    <input type="text" placeholder='영상에 대한 내용을 적어주세요.' id="description" name="description" />
                  </div>
                  <div>
                   <button id="login-submit" type="submit">업로드</button>
                  </div>
                </form> : <Loading />
                  }
          </div>
        </div>
        );
}