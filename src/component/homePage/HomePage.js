import React from "react";
import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { isUserExist } from "../auth/Auth";

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/log-in");
    }

    const handleSign = () => {
        navigate("/sign-up");
    }

    const handleDash = () => {
        navigate("/main")
    }
    
    const handleLogOut = (event) => {
        sessionStorage.setItem("Social-User", "");
        sessionStorage.clear();
        navigate("/");
    }
    
    return (
        <div className="homepage">
            <nav className="navbar">
                <h2 className="logo" style={{position:"relative" ,top:"35px"}}>Social<span>.</span></h2>

                <ul className="nav-links">
                    <li>Home</li>
                    <li>Services</li>
                    <li>About Us</li>
                    <li>Contact</li>
                </ul>
                
                {!isUserExist() && <label className="login-btn" onClick={handleLogin}>Login</label>}
                {isUserExist() && <label className="login-btn" onClick={handleLogOut}>Log-out</label>}
            </nav>

            <section className="hero">
                <div className="hero-text">
                    <h1>
                        MEET SOCIAL media <br /> expert in <span>tzz</span><span className="dot">.</span>
                    </h1>
                    <p>
                        Efficiently handle your social media accounts with Agorapulse's inbox,
                        helping you stay organized, save time, and manage your channels with ease.
                    </p>
                    <div className="hero-buttons">
                        {!isUserExist() && <button className="register" onClick={handleSign}>Register Now</button>}
                        <button className="message" onClick={handleDash}>
                            <i className="bi bi-chat-left"></i> Message
                        </button>
                    </div>
                    <div className="profile-icons">
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                        <i className="bi bi-person-circle user-icon"></i>
                    </div>
                </div>

                <div className="hero-image">
                    <img src="/images/p1.png" alt="Graph chart" />
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