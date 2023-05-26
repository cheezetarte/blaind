import "./intro.css"
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Howto from "./Howto";

export default function Intro(){
  return(
  <div>
    <Header />
    <div className="intro-content">
        <Howto />
    </div>
    <Footer />
  </div>
  );
};