import Sidebar from "../Sidebar/Sidebar";
import "./Notification.css";

function Notification() {
    return <>
        <div className="connections-page">
            <div className="sidebar-container" style={{ position: "relative", top: "-170px", left: "-230px" }}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="connections-main">
                <h2 className="connections-title">Connections</h2>
                <p className="connections-subtitle">
                    Manage your network and discover new connections
                </p>

                {/* Stats Cards */}
                <div className="connections-stats">
                    <div className="stat-card">
                        <span className="stat-number1">0</span>
                        <span className="stat-label">Followers</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number1">1</span>
                        <span className="stat-label">Following</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number1">0</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number1">0</span>
                        <span className="stat-label">Connections</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="connections-tabs">
                    <button className="tab active">Followers</button>
                    <button className="tab">Following</button>
                    <button className="tab">Pending</button>
                    <button className="tab">Connections</button>
                </div>
            </div>
        </div>
    </>
}

export default Notification;