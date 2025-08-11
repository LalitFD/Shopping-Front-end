import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import image from "./userProfile.jpeg"
import "./Notification.css";
import { BASE_URL } from "../../api/End_Points";

function Notification() {
    const [activeTab, setActiveTab] = useState("followers");
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const res = await axios.get(BASE_URL + "/connection", {
                    withCredentials: true
                });
                setFollowers(res.data.followers);
                setFollowing(res.data.following);
            } catch (err) {
                console.error("Error fetching connections:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConnections();
    }, []);

    const renderList = () => {
        const data = activeTab === "followers" ? followers : following;
        if (loading) return <p className="loading-text">Loading...</p>;
        if (data.length === 0) return <p className="empty-text">No {activeTab} found</p>;

        return data.map(user => (
            <div key={user._id} className="user-card">
                <img
                    src={image}
                    // alt={user.name}
                    className="user-avatar"
                />
                <div className="user-info">
                    <h4 style={{ color: "white" }}>{user.name}</h4>
                    <p>@{user.username}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="connections-page">
            <Sidebar />

            <div className="connections-main">
                <h2 className="connections-title">Connections</h2>
                <p className="connections-subtitle">
                    Manage your network and discover new connections
                </p>

                <div className="connections-stats">
                    <div className="stat-card">
                        <span className="stat-number1">{followers.length}</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number1">{following.length}</span>
                        <span className="stat-label">Following</span>
                    </div>
                </div>

                <div className="connections-tabs">
                    <button
                        className={`tab ${activeTab === "followers" ? "active" : ""}`}
                        onClick={() => setActiveTab("followers")}
                    >
                        Followers
                    </button>
                    <button
                        className={`tab ${activeTab === "following" ? "active" : ""}`}
                        onClick={() => setActiveTab("following")}
                    >
                        Following
                    </button>
                </div>

                <div className="connections-list">{renderList()}</div>
            </div>
        </div>
    );
}

export default Notification;
