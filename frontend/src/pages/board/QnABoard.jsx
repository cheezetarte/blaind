import Footer from "../../components/Footer";
import Header from "../../components/Header";
import StartFreeButton from "../../components/StartForFree";
import QnAList from "./QnAList";
import './Main.css';
import './PostList.css'
import PathButton from "../../components/table/PathButton";
import MakePost from './makeboardcomp'

export default function QnAboard(){
  return(
  <div>
    <Header />
    <div className="body-content">
          <div className='text'>
            <section>
                <p className = "title" style = {{marginBottom:'5px'}}>Questions And Answers</p>
                <PathButton/>
            </section>
          </div>
          <div>
            <QnAList />
          </div>
          <div>
          <StartFreeButton />
          </div>
    </div>
    
    <Footer />
  </div>
  );
};