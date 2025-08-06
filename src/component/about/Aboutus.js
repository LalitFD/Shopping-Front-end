import './Aboutus.css';
import abImage from './ab.png';



function Aboutus() {
    return <>
        <section className="about-section">
            <h2><span className="highlight">About</span> Us</h2>
            <p className="subtext">
                We're passionate about helping businesses grow their social media presence with cutting-edge technology and expert insights.
            </p>

            <div className="about-content">
                <div className="about-text">
                    <h3>Empowering Your Digital Journey</h3>
                    <p>
                        Founded in 2020, Social. has been at the forefront of social media management innovation. Our team of experts understands the ever-changing landscape of social platforms and helps businesses navigate the complexities of digital marketing.
                    </p>
                    <p>
                        We believe that every brand has a unique story to tell. Our platform provides the tools and insights needed to tell that story effectively across all social media channels, driving engagement and building meaningful connections with your audience.
                    </p>

                    <div className="tags">
                        <span className="tag green">AI Powered</span>
                        <span className="tag light-green">Data-Driven</span>
                        <span className="tag soft-green">User-Friendly</span>
                    </div>
                </div>

                <div className="about-image">
                    <img src={abImage} alt="Team" />
                </div>
            </div>

            <div className="stats">
                <div className="stat">
                    <div className="icon">👥</div>
                    <h4>10K+</h4>
                    <p>Active Users</p>
                </div>
                <div className="stat">
                    <div className="icon">📄</div>
                    <h4>50M+</h4>
                    <p>Post Managed</p>
                </div>
                <div className="stat">
                    <div className="icon">⚙️</div>
                    <h4>99%</h4>
                    <p>Uptime</p>
                </div>
                <div className="stat">
                    <div className="icon">⚡</div>
                    <h4>24/7</h4>
                    <p>Support</p>
                </div>
            </div>
        </section>
    </>
}

export default Aboutus;