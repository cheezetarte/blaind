import './Main.css';
import MainImage from "./MainImage";
import Reason from "./Reason";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UploadSection from "./UploadSection";
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

export default function Main(){
  return(
  <div>
    <Header />
    <div className="body-content">
        <section>
            <p className = "title"> BLAIND - 자동 얼굴인식 모자이크 AI</p>
            <p className = "title2"> AI를 이용해서 얼굴을 인식하고 편하게 영상에 모자이크를 입혀보세요</p>
          <div>
            <Zoom>
              <UploadSection />
            </Zoom>
            <p className = "title"> 편리한 영상 편집과 다운로드</p>
            <Fade><MainImage /></Fade>
            <Reason />
          </div>
        </section>
    </div>
    <Footer />
  </div>
  );
};