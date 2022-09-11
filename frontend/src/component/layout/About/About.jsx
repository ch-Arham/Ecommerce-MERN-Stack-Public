import React from "react";
import "./About.css";
import MetaData from "../MetaData";

const About = () => {
  return (
    <>
      <MetaData title="About Us" />
      <div className="aboutContainer">
        {/* iframe to show https://ch-arham.netlify.app/ */}
        <iframe
          src="https://ch-arham.netlify.app/"
          title="About"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </>
  );
};

export default About;
