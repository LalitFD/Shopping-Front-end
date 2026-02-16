import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import photo from "./userProfile.jpeg"
import End_Points from "../../api/End_Points";
import "./discover.css"


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
      const res = await axios.get(End_Points.DISCOVER, {
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
        `${End_Points.FOLLOW}${userId}`,
        {},
        {
          withCredentials: true
        }
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
    <>
      <Sidebar />
      <div className="discover-page-container">
        {/* Header Section */}
        <div className="discover-header">
          <h1 className="discover-main-title">
            Discover People
          </h1>
          <p className="discover-main-subtitle">
            Connect with amazing people and grow your network
          </p>
        </div>

        <div className="discover-search-container">
          <div className="discover-search-box">
            <i className="bi bi-search discover-search-icon"></i>

            <input
              type="text"
              placeholder="Search people by name, username, bio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="discover-search-input"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className={`discover-search-btn ${loading ? 'discover-loading' : ''}`}
            >
              {loading ? (
                <span className="discover-loading-content">
                  <div className="discover-spinner"></div>
                  Searching...
                </span>
              ) : "Search"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="discover-results-container">
          {results.length > 0 ? (
            <div className="discover-user-grid">
              {results.map((user) => (
                <div
                  key={user._id}
                  className="discover-user-card"
                >
                  <div className="discover-user-avatar-container">
                    <img
                      src={photo}
                      alt={user.name}
                      className="discover-user-avatar"
                    />
                    <div className="discover-user-badge">
                      <i className="bi bi-check"></i>
                    </div>
                  </div>

                  <div className="discover-user-info">
                    <h4 className="discover-user-name">
                      {user.name}
                    </h4>
                    <p className="discover-user-username">
                      @{user.username}
                    </p>
                    <p className="discover-user-bio">
                      {user.bio || "No bio available"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleFollow(user._id)}
                    disabled={followLoading === user._id}
                    className={`discover-follow-btn ${user.isFollowed ? 'discover-following' : ''} ${followLoading === user._id ? 'discover-btn-loading' : ''}`}
                  >
                    {followLoading === user._id ? (
                      <span className="discover-btn-loading-content">
                        <div className="discover-btn-spinner"></div>
                        Loading...
                      </span>
                    ) : user.isFollowed ? (
                      <span className="discover-btn-content">
                        <i className="bi bi-check-lg"></i>
                        Following
                      </span>
                    ) : (
                      <span className="discover-btn-content">
                        <i className="bi bi-plus-lg"></i>
                        Follow
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="discover-empty-state">
              <i className="bi bi-search discover-empty-icon"></i>
              <p className="discover-empty-text">
                {loading ? "Searching for people..." : "No users found. Try searching something!"}
              </p>
            </div>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </>
  );
}

export default Discover;
