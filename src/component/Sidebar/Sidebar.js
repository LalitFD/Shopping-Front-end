import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`} style={{ height: "94vh" }}>

        <div className="logo" onClick={() => navigate("/Main")} style={{ textAlign: "start" }}>
          Social
        </div>

        <NavLink
          to="/Main"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-house-heart"></i>
          </span>
          Feed
        </NavLink>

        <NavLink
          to="/discover"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-search"></i>
          </span>
          Discover
        </NavLink>

        <NavLink
          to="/Message"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-chat"></i>
          </span>
          Messages
        </NavLink>

        <NavLink
          to="/Music"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-music-note-beamed"></i>
          </span>
          Music
        </NavLink>


        <NavLink
          to="/Reel"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i class="bi bi-file-earmark-play"></i>
          </span>
          Reel
        </NavLink>

        <NavLink
          to="/Notification"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-people-fill"></i>
          </span>
          Connections
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "sidebar-item active" : "sidebar-item")}
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-person"></i>
          </span>
          Profile
        </NavLink>

        <NavLink
          to="/CreatePost"
          className={({ isActive }) =>
            isActive ? "sidebar-item active create-btn" : "sidebar-item create-btn"
          }
        >
          <span className="sidebar-item-icon">
            <i className="bi bi-plus-circle"></i>
          </span>
          Create Post
        </NavLink>

        
      </div>
    </div>
  );
}

export default Sidebar;