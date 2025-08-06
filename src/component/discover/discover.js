import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./discover.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import photo from "./userProfile.jpeg"

function Discover() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
     const [followLoading, setFollowLoading] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            toast.warn("Please enter a search term!");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3000/searchUsers`, {
                params: { query },
                withCredentials: true,
            });

            setResults(res.data.users);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Search failed!");
        } finally {
            setLoading(false);
        }
    };


    const handleFollow = async (userId) => {
        try {
            setFollowLoading(userId);

            const res = await axios.post(
                `http://localhost:3000/follow/${userId}`,
                {},
                { withCredentials: true }
            );

            toast.success(res.data.message || "Followed successfully!");

            setResults((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, isFollowed: !u.isFollowed } : u
                )
            );
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to follow!");
        } finally {
            setFollowLoading(null);
        }
    };

    return (
        <div className="discover-page">
            <div className="container" style={{ marginLeft: "-290px" }}>
                <Sidebar />
            </div>

            <div className="discover-main">
                <h2 className="discover-title">Search People</h2>
                <p className="discover-subtitle">
                    Connect with amazing people and grow your network
                </p>

                <div className="search-box">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search people by name, username, bio..."
                        className="search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className="search-button" onClick={handleSearch}>
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                <div className="search-results">
                    {results.length > 0 ? (
                        results.map((user) => (
                            <div key={user._id} className="user-card">
                                <img
                                    src={photo}
                                    alt={user.name}
                                    className="user-avatar"
                                />

                                <div className="user-info">
                                    <h4>{user.name}</h4>
                                    <p>@{user.username}</p>
                                    <p className="user-bio">{user.bio}</p>
                                </div>

                                {/* Follow Button */}
                                <button
                                    className="follow-button"
                                    onClick={() => handleFollow(user._id)}
                                    disabled={followLoading === user._id}
                                    style={{
                                        backgroundColor: user.isFollowed ? "#aaa" : "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        marginLeft: "auto",
                                        height: "35px"
                                    }}
                                >
                                    {followLoading === user._id
                                        ? "Processing..."
                                        : user.isFollowed
                                            ? "Unfollow"
                                            : "Follow"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginTop: "20px", color: "#999" }}>
                            {loading ? "" : "No users found. Try searching something!"}
                        </p>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default Discover;
