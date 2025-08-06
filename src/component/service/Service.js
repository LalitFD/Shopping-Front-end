import './Service.css';

function Service() {
    return <>
        <section className="services-section">
            <h2 style={{ color: "#5FD13C" }}><span className="highlight">Our</span> Services</h2>
            <p className="subtext">
                Comprehensive social media management solutions designed to help your brand grow and engage with your audience effectively.
            </p>

            <div className="services-cards">
                <div className="card">
                    <div className="icon">📅</div>
                    <h3>Content <span className="error">Scheduling</span></h3>
                    <p>
                        Plan and schedule your content across all platforms with our intuitive scheduling tools and calendar view.
                    </p>
                </div>

                <div className="card">
                    <div className="icon">📊</div>
                    <h3>Analytics Reporting</h3>
                    <p>
                        Get detailed insights and performance metrics to understand your audience and optimize your strategy.
                    </p>
                </div>

                <div className="card">
                    <div className="icon">💬</div>
                    <h3>Social Inbox Management</h3>
                    <p>
                        Manage all your social media conversations in one place with our unified inbox and response tools.
                    </p>
                </div>

                <div className="card">
                    <div className="icon">📈</div>
                    <h3>Growth Strategy</h3>
                    <p>
                        Develop data-driven growth strategies with our expert recommendations and trend analysis.
                    </p>
                </div>
            </div>

            <button className="explore-btn">Explore More</button>
            <p className="footer-text">Ready to transform your social media presence?</p>
        </section>
    </>
}

export default Service;