import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import image from "./userProfile.jpeg";
import "./Notification.css";
import { BASE_URL } from "../../api/End_Points";

function Notification() {
  const [activeTab, setActiveTab] = useState("followers");
  const [data, setData] = useState({ followers: [], following: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/connection`, { withCredentials: true })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching connections:", err))
      .finally(() => setLoading(false));
  }, []);

  const tabs = ["followers", "following"];
  const currentList = data[activeTab] || [];

  return (
    <div className="notif-page">
      <Sidebar />
      <div className="notif-main">
        <h2 className="notif-title">Connections</h2>
        <p className="notif-subtitle">
          Manage your network and discover new connections
        </p>

        <div className="notif-stats">
          {tabs.map((type) => (
            <div className="notif-stat-card" key={type}>
              <span className="notif-stat-number">{data[type]?.length || 0}</span>
              <span className="notif-stat-label">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="notif-tabs">
          {tabs.map((type) => (
            <button
              key={type}
              className={`notif-tab ${activeTab === type ? "notif-tab-active" : ""}`}
              onClick={() => setActiveTab(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="notif-list">
          {loading ? (
            <p className="notif-loading">Loading...</p>
          ) : currentList.length === 0 ? (
            <p className="notif-empty">No {activeTab} found</p>
          ) : (
            currentList.map((user) => (
              <div key={user._id} className="notif-user-card">
                <img src={image} className="notif-user-avatar" alt="" />
                <div className="notif-user-info">
                  <h4 className="notif-user-name">{user.name}</h4>
                  <p className="notif-user-username">@{user.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
