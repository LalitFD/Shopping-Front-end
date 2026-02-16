import './Service.css';

function Service() {
  return <>
    <section className="services-section">
      <h2 style={{ color: "#5FD13C" }}><span className="highlight">Our</span> Features</h2>
      <p className="subtext">
        Everything you need to connect, share, and grow with your community.
      </p>

      <div className="services-cards">
        <div className="card">
          <div className="icon">📅</div>
          <h3>Create &<span className="error">Share</span></h3>
          <p>
            Post photos, videos, and stories to express yourself and share moments with your friends and followers.
          </p>
        </div>

        <div className="card">
          <div className="icon">📊</div>
          <h3>Connect & Chat</h3>
          <p>
            Follow people, send direct messages, and stay in touch with your community in real time.
          </p>
        </div>

        <div className="card">
          <div className="icon">💬</div>
          <h3>Discover Content</h3>
          <p>
            Explore trending posts, hashtags, and creators to find what inspires you.
          </p>
        </div>

        <div className="card">
          <div className="icon">📈</div>
          <h3>Grow Your Profile</h3>
          <p>
            Build your audience with likes, comments, and followers, and showcase your creativity to the world.
          </p>
        </div>
      </div>
      <button className="explore-btn">Explore More</button>
      <p className="footer-text">Ready to dive into your social media journey?</p>
    </section>
  </>
}

export default Service;
