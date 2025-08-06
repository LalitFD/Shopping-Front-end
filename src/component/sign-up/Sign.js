import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sign.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import End_Points from "../../api/End_Points";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sign() {
    const nevigate = useNavigate();

    const [state, setState] = useState({
        name: "",
        email: "",
        username: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const response = await axios.post(End_Points.SIGN_UP, state);
            toast.success(response.data.message);
            setState({
                name: "",
                email: "",
                username: "",
                password: ""
            });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
                nevigate("/log-in");


            } else {
                toast.error("Oops! Something went wrong..");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="login-page">
                {/* Left Section */}
                <div className="login-left">
                    <h2 className="logo" style={{ position: "relative", right: "10%", top: "-3%" }}>Social</h2>
                    <p className="main-text" style={{ position: "relative", right: "5%", top: "-3%" }}>
                        Connect with the world <span style={{ color: "green" }}>instantly</span> join the ultimate <strong style={{ color: "green" }}>Social Hub.</strong>
                    </p>
                    {/* <p className="subtext" style={{ position: "relative", position: "relative", right: "5%", top: "-200px", fontSize: "15px" }}>
                        Stay updated, share moments and grow your network.
                        <br />
                        Unlimited access to posts, reels, stories, and more – all in one place.
                    </p> */}


                    <img
                        src="https://i.pinimg.com/736x/57/65/de/5765de283e421d5d07548a897f584e52.jpg"
                        alt="Login Illustration"
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))",
                            position: "relative",
                            top: "-25px"
                        }}
                    />

                </div>

                {/* Right Section */}
                <div className="login-right">
                    {isLoading ? (
                        <div className="loading-text">Loading...</div>
                    ) : (
                        <>
                            <h2 className="form-title">Sign Up</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
                                    value={state.name}
                                    onChange={(e) => setState({ ...state, name: e.target.value })}
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                />
                                <input
                                    style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
                                    value={state.email}
                                    onChange={(e) => setState({ ...state, email: e.target.value })}
                                    type="email"
                                    placeholder="Enter Email"
                                    required
                                />
                                <input
                                    style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
                                    value={state.username}
                                    onChange={(e) => setState({ ...state, username: e.target.value })}
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                                <input
                                    style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
                                    value={state.password}
                                    onChange={(e) => setState({ ...state, password: e.target.value })}
                                    type="password"
                                    placeholder="Create Password"
                                    required
                                />
                                <button type="submit" className="submit-btn">Sign Up</button>
                            </form>
                            <p className="signup-link">
                                Already have an account?{" "}
                                <Link to="/log-in" className="login-link">Log-In</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Sign;
