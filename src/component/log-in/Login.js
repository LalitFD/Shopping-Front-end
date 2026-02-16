import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import End_Points from "../../api/End_Points";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: ""
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!state.email || !state.password) {
        toast.error("Please enter both email and password");
        return;
      }
      const response = await axios.post(End_Points.LOG_IN, state, { withCredentials: true });
      const { user, token, message } = response.data;

      if (!user.isVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      sessionStorage.setItem(
        "Social-User",
        JSON.stringify({ ...user, token })
      );
      toast.success(message);
      navigate("/Main");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="login-page" style={{ background: "linear-gradient(135deg, #5FD13C, #999999)" }}>
        <div className="login-left">
          <h2 className="logo" style={{ position: "relative", right: "43%", top: "-3%" }}>Social</h2>

          <p style={{ position: "relative", right: "5%", top: "-3%" }}>
            Connect with the world <span style={{ color: "green" }}>instantly</span> join the ultimate <strong style={{ color: "green" }}>Social Hub.</strong>
          </p>

          <img
            src="https://i.pinimg.com/736x/57/65/de/5765de283e421d5d07548a897f584e52.jpg"
            alt="Login Illustration"
            style={{ width: "100%", height: "auto", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", position: "relative", top: "-25px" }}
          />

        </div>

        <div className="login-right">
          <h3 style={{ color: "black" }}>Welcome again 👋</h3>

          <h2 style={{ color: "black" }}>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              value={state.email}
              onChange={(event) => setState({ ...state, email: event.target.value })}
              type="text"
              placeholder="Email"
              style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
            />
            <input
              value={state.password}
              onChange={(event) => setState({ ...state, password: event.target.value })}
              type="password"
              placeholder="Enter Password"
              style={{ borderRadius: "12px", boxShadow: "2px 2px 2px grey" }}
            />
            <button type="submit">LOGIN</button>
          </form>
          <div className="signup-link">
            Don’t have an account?{" "}
            <Link to="/sign-up" style={{ color: "green", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
