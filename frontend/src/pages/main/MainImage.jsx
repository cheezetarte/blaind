import './MainImage.css';
import editor from '../../assets/image/editor.png';

const MainImage = () =>{
    return(
    <div className="image-container">
        <img id="editor-image" alt="logo" src={editor}/>
    </div>
    );
}

export default MainImage;