import React from 'react'
import { useHistory } from "react-router-dom";

// importing assets
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";

// importing styles
import "./Footer.css";

const Footer = () => {
    const history = useHistory();
  return (
    <footer id="footer">
        {/* Left Side */}
        <div className="leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="Appstore" />
        </div>

        {/* Middle  */}
        <div className="midFooter">
            <h1 
                 onClick={() => {
                    // scroll to top if on home page else navigate to home page
                    window.location.pathname === "/"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : history.push("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            ><span>ECOMMERCE.</span></h1>
            <p>High Quality is our first priority</p>

            <p>Copyrights 2022 &copy; ArhamK</p>
            </div>

        {/* Right Side */}
        <div className="rightFooter">
            <h4>Follow Us</h4>
            <a 
                href="https://www.linkedin.com/in/arham-khawar-6a01bb1b6/" 
                target="_blank" 
                rel="noopener noreferrer" 
            >
                LinkedIn
            </a>
            <a 
                href="https://github.com/ch-Arham"
                target="_blank"
                rel="noopener noreferrer"
            >
                Github
            </a>
            <a 
                href="https://twitter.com/Ch_ArhamK"
                target="_blank"
                rel="noopener noreferrer"
            >
                Twitter
            </a>
        </div>


    </footer>
  )
}

export default Footer