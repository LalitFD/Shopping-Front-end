import React from "react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { isUserExist } from "../auth/Auth";


const HomePage = () => {
    const nevigate = useNavigate();

    const handleLogin = () => {
        nevigate("/log-in");
    }

    const handleSign = () => {
        nevigate("/sign-up");
    }

    const handleDash = () => {
        nevigate("/main")
    }
    const handleLogOut = (event) => {
        sessionStorage.setItem("Social-User", "");
        sessionStorage.clear();
        nevigate("/");
    }
    return (
        <div className="homepage">

            <nav className="navbar">
                <h2 className="logo" style={{position:"relative", top:"40px"}}>Social<span>.</span></h2>

                <ul className="nav-links">
                    <li style={{ letterSpacing: "2px" }}>Home</li>
                    <li style={{ letterSpacing: "2px" }}>Services</li>
                    <li style={{ letterSpacing: "2px" }}>About Us</li>
                    <li style={{ letterSpacing: "2px" }}>Contact</li>
                </ul>
                
                {!isUserExist() && <label className="login-btn" onClick={handleLogin}>Login</label>}
                {isUserExist() && <label className="login-btn" onClick={handleLogOut}>Log-out</label>}
            </nav>


            <section className="hero">
                <div className="hero-text">
                    <h1>
                        MEET SOCIAL media <br /> expert in <span>tzz</span><span className="dot">.</span>
                    </h1>
                    <p style={{ letterSpacing: "2.5px" }}>
                        Efficiently handle your social media accounts with Agorapulse's inbox,
                        helping you stay organized, save time, and <br />
                        manage your channels with ease.
                    </p>
                    <div className="hero-buttons">
                        {!isUserExist() && <button className="register" onClick={handleSign}>Register Now</button>}

                        <button className="message" onClick={handleDash}><i className="bi bi-chat-left" style={{ color: "black" }}></i> Message</button>
                    </div>
                    <div className="profile-icons">
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                    </div>
                </div>

                <div className="hero-image">
                    <img src="/images/p1.png" alt="Graph chart" style={{ width: "80%" }} />
                    <div className="social-icons">
                        <i className="bi bi-facebook social-icon icon-facebook"></i>
                        <i className="bi bi-instagram social-icon icon-instagram"></i>
                        <i className="bi bi-youtube social-icon icon-youtube"></i>
                        <i className="bi bi-tiktok social-icon icon-tiktok"></i>
                        <i className="bi bi-music-note-beamed social-icon icon-music"></i>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
