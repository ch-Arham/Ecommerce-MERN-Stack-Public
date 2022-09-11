import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";
import MetaData from "../MetaData";

const Contact = () => {
  return (
    <>
      <MetaData title="Contact Us" />
      <div className="contactContainer">
        <a className="mailBtn" href="mailto:ch.arham1220@gmail.com">
          <Button>Contact: ch.arham1220@gmail.com</Button>
        </a>
      </div>
    </>
  );
};

export default Contact;
