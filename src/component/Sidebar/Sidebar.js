import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    return (
        <div className="sidebar" style={{ height: "585px", marginLeft: "-2px" }}>
            <div className="logo" onClick={() => navigate("/Main")} style={{cursor:"pointer"}}>Social</div>

            <NavLink
                to="/Main"
                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
            >
                <span className="sidebar-item-icon"><i className="bi bi-house-heart"></i></span>
                Feed
            </NavLink>

            <NavLink
                to="/discover"
                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
            >
                <span className="sidebar-item-icon"><i className="bi bi-search"></i></span>
                Discover
            </NavLink>

            <NavLink
                to="/Message"
                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
            >
                <span className="sidebar-item-icon"><i className="bi bi-chat"></i></span>
                Messages
            </NavLink>

            <NavLink
                to="/notifications"
                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
            >
                <span className="sidebar-item-icon"><i className="bi bi-bell"></i></span>
                Notifications
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
            >
                <span className="sidebar-item-icon"><i className="bi bi-person"></i></span>
                Profile
            </NavLink>

            <NavLink
                to="/CreatePost"
                className={({ isActive }) => isActive ? "sidebar-item active create-btn" : "sidebar-item create-btn"}
                style={{ backgroundColor: "white", color: "black", fontWeight: "bold", borderRadius: "5px", marginTop: "20px", width: "90%", marginLeft: "13px" }}
            >
                <span className="sidebar-item-icon"><i className="bi bi-plus-circle"></i></span>
                Create Post
            </NavLink>
        </div>
    );
}

export default Sidebar;
