import "./HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import { isUserExist } from "../auth/Auth";
import profile from "./p2.jpeg"
import { navLinks } from "../../constant/home";
import homeImage from "./p1.png"

import Button from "../Button/Button.js";


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

  const handleLogOut = () => {
    sessionStorage.setItem("Social-User", "");
    sessionStorage.clear();
    navigate("/");
  }

  return (
    <div className="homepage">
      <nav className="navbar">
        <h2 className="logo" style={{ position: "relative", top: "35px" }}>Social<span>.</span></h2>

        <ul className="nav-links">
          {navLinks.map((n, index) => (
            <li key={index}>{n}</li>
          ))}
        </ul>

        {!isUserExist() && <label className="login-btn" onClick={handleLogin}>Login</label>}
        {isUserExist() && <label className="login-btn" onClick={handleLogOut}>Log-out</label>}
      </nav>
      <section className="hero">
        <div className="hero-text">
          <h1>
            MEET YOUR SOCIAL <br />media world <span>🌍</span><span className="dot">.</span>
          </h1>
          <p>
            Create posts, follow friends, explore trending content, and grow your network. Our platform makes it easy to share ideas, express yourself, and stay connected with the people that matter.
          </p>
          <div className="hero-buttons">

            {/* {!isUserExist() && <button className="register" onClick={handleSign}>🚀 Join Now</button>} */}

            {!isUserExist() && <Button label="🚀 Join Now" onClick={handleSign} className="register" />}

            {/* <button className="message" onClick={handleDash}>
              🫡 Explore Feed<i class="bi bi-arrow-right-circle"></i>
            </button> */}

            <Button className="message" onClick={handleDash} label={"🫡 Explore Feed"} />

          </div>
          
          <div className="profile-icons">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={profile}
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1.5px solid white",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-image">
          <img src={homeImage} alt="Graph chart" />
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
