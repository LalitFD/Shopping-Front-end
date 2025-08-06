import './Contact.css';
function Contact() {
    return <>
        <div className="contact-section">
            <h2>
                Get In <span className="highlight">Touch</span>
            </h2>
            <p>
                Ready to transform your social media presence? Let's start a conversation about how we can help your business grow.
            </p>

            <div className="contact-container">
                <div className="contact-info">
                    <h3>Lets Connect</h3>
                    <div className="info-item">
                        <span className="icon">📧</span>
                        <div>
                            <strong>Email</strong>
                            <p>hello@social.com</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="icon">📞</span>
                        <div>
                            <strong>Phone</strong>
                            <p>+91 7610712047</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <span className="icon">📍</span>
                        <div>
                            <strong>Address</strong>
                            <p>Vijayanagar Indore</p>
                        </div>
                    </div>

                    <div className="why-choose">
                        <h4>Why Choose Social. ?</h4>
                        <ul>
                            <li>Expert social media management</li>
                            <li>AI-powered content optimization</li>
                            <li>24/7 customer support</li>
                            <li>Proven results for 10K+ businesses</li>
                        </ul>
                    </div>
                </div>

                <form className="contact-form">
                    <h3>Send us a message</h3>
                    <div className="row">
                        <input type="text" placeholder="Your First Name" />
                        <input type="text" placeholder="Your Last Name" />
                    </div>
                    <input type="email" placeholder="your.email@example.com" />
                    <input type="text" placeholder="Your Company Name" />
                    <textarea placeholder="Tell us about Your Project..."></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    </>
}

export default Contact;