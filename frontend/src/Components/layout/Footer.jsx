import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* Main Footer */}
      <footer className="footer-section mt-4 py-5" style={{
        background: "#F5F5F5",
        color: "#333333",
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div className="container">
          <div className="row justify-content-between align-items-center">
            {/* Column 1: Brand & Socials */}
            <div className="col-12 col-md-5 mb-4 mb-md-0 text-center text-md-left">
              <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginBottom: '15px' }}>
                <img src="/images/logo.svg" alt="logo" style={{ height: "45px", width: "auto" }} />
              </Link>
              <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: "1.5", margin: "0 0 15px 0" }}>
                Feast Your Senses, Fast and Fresh. Discover the best food options from local restaurants and order instantly.
              </p>
              {/* Social Icons */}
              <div className="d-flex justify-content-center justify-content-md-start mt-2" style={{ gap: "16px" }}>
                <a href="#" style={{ color: "#000", fontSize: "1.3rem", marginRight: "10px" }}><i className="fa fa-facebook-official" aria-hidden="true"></i></a>
                <a href="#" style={{ color: "#000", fontSize: "1.3rem", marginRight: "10px" }}><i className="fa fa-instagram" aria-hidden="true"></i></a>
                <a href="#" style={{ color: "#000", fontSize: "1.3rem", marginRight: "10px" }}><i className="fa fa-twitter" aria-hidden="true"></i></a>
                <a href="#" style={{ color: "#000", fontSize: "1.3rem" }}><i className="fa fa-snapchat-ghost" aria-hidden="true"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-12 col-md-4 text-center text-md-right">
              <h6 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#000", marginBottom: "15px" }}>Quick Links</h6>
              <ul className="list-unstyled" style={{ lineHeight: "2.2", fontSize: "0.85rem", padding: 0 }}>
                <li><Link to="/" style={{ color: "#555", textDecoration: "none" }} className="hover-orange-text">Home</Link></li>
                <li><Link to="/cart" style={{ color: "#555", textDecoration: "none" }} className="hover-orange-text">My Cart</Link></li>
                <li><Link to="/users/login" style={{ color: "#555", textDecoration: "none" }} className="hover-orange-text">Login / Register</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div style={{ background: "#03081F", color: "#CCCCCC", fontFamily: "'Outfit', sans-serif" }} className="py-3">
        <div className="container text-center">
          <div style={{ fontSize: "0.8rem" }}>
            Food Genie © Copyright 2026, All Rights Reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
