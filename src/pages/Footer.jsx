import React from "react";
import "./Footer.css";
import logo from '../assets/LogoFooter.svg';

const Footer = () => {
    return(
        <footer className="footer">
            <img className="float-left logo" src={logo} alt=""/>
            <p className="float-right">Copyright ©2020 All rights reserved | Gezi Turismo</p>
        </footer>
    )
}

export default Footer;