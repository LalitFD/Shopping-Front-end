import './Aboutus.css';
import abImage from './au.png';

function Aboutus() {
  return <>
    <section className="about-section">
      <h2><span className="highlight">About</span> Us</h2>
      <p className="subtext">
        We’re passionate about building a space where people can connect, share, and grow together.
      </p>

      <div className="about-content">
        <div className="about-text">
          <h3>Empowering Your Social Journey</h3>
          <p>
            Launched with a simple idea — to bring people closer through digital connections — our platform is designed for everyone who wants to share their voice, discover new content, and engage with communities that inspire them
          </p>
          <p>
            We believe social media should be more than just posts. It’s about creating meaningful interactions, discovering ideas, and building lasting relationships
          </p>

          <div className="tags">
            <span className="tag green">🌍 Global Community</span>
            <span className="tag light-green">⚡ Fast & Secure</span>
            <span className="tag soft-green">💡 Easy to Use</span>
          </div>
        </div>

        <div className="about-image">
          <img src={abImage} alt="Team" />
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="icon">👥</div>
          <h4 style={{ position: "relative", top: "9%" }}>10</h4>
          <p style={{ position: "relative", top: "19%", left: "2%" }}>Active Users</p>
        </div>
        <div className="stat">
          <div className="icon">📄</div>
          <h4 style={{ position: "relative", top: "9%" }}>50</h4>
          <p style={{ position: "relative", top: "19%", left: "2%" }}>Post Managed</p>
        </div>
        <div className="stat">
          <div className="icon">⚙️</div>
          <h4 style={{ position: "relative", top: "9%" }}>99%</h4>
          <p style={{ position: "relative", top: "19%", left: "2%" }}>Uptime</p>
        </div>
        <div className="stat">
          <div className="icon">⚡</div>
          <h4 style={{ position: "relative", top: "9%" }}>24/7</h4>
          <p style={{ position: "relative", top: "19%", left: "2%" }}>Support</p>
        </div>
      </div>
    </section>
  </>
}

export default Aboutus;
