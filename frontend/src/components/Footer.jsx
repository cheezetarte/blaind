import './Footer.css';

const Footer = () => {
    return(
    <footer>
        <div className="footer-container">
            <div className="footer-content">
            <ul className="footer-list">
                <li><h5 className="text-uppercase">Windows용</h5></li>
                <li><a href="#!" className="text-dark">BLAIND Editor</a></li>
                <li><a href="#!" className="text-dark">모든 Windows 제품</a></li>
            </ul>
            </div>

            <div className="footer-content">
                <ul className="footer-list">
                    <li><h5 className="text-uppercase mb-0">Mac용</h5></li>
                    <li><a href="#!" className="text-dark">BLAIND Editor</a></li>
                    <li><a href="#!" className="text-dark">모든 MAC 제품</a></li>
                </ul>
            </div>

            <div className="footer-content">
                <ul className="footer-list">
                    <li><h5 className="text-uppercase">도움말</h5></li>
                    <li><a href="#" className="text-dark">지원</a></li>
                    <li><a href="#" className="text-dark">학습 포털</a></li>
                </ul>
            </div>

            <div className="footer-content">
            <ul className="footer-list">
                <li><h5 className="text-uppercase mb-0">회사</h5></li>
                <li><a className="text-dark" href="https://aivle.kt.co.kr/" target="_blank">KT Aivle School</a></li>
                <li><a href="#!" className="text-dark">BLAIND</a></li>
            </ul>
            </div>
        </div>  
                    
        <div className="copyright">
            © 2022 Copyright:
            <a className="text" href="https://aivle.kt.co.kr/" target="_blank">KT Aivle School</a>
        </div>
    </footer>
    );
}

export default Footer;
