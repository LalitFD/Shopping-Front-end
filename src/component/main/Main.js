import { useNavigate } from "react-router-dom";
import img from "./c.jpeg";
import "./Main.css";
import Sidebar from "../Sidebar/Sidebar";
import End_Points from "../../api/End_Points";
import { useEffect, useState } from "react";
import axios from "axios";

function Main() {
    const userData = JSON.parse(sessionStorage.getItem("Social-User"));
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);

    // Fetch Stories
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(End_Points.GET_STORIES);
                console.log("Stories response:", response.data);
                setStories(response.data || []);
            } catch (err) {
                console.error("Error fetching stories:", err);
                setStories([]);
            }
        };
        fetchStories();
    }, []);

    // Fetch Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(End_Points.GET_ALL_POST);
                console.log("API response:", response.data);
                console.log("Posts data:", response.data.posts);
                
                // Debug each post
                if (response.data.posts) {
                    response.data.posts.forEach((post, index) => {
                        console.log(`Post ${index}:`, post);
                        console.log(`Author:`, post?.author);
                        console.log(`Media:`, post?.media);
                        if (post?.media?.[0]?.url) {
                            console.log(`Image URL:`, post.media[0].url);
                        }
                    });
                }
                
                setPosts(response.data.posts || []);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, []);

    // Handle Delete Post
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${End_Points.DELETE_POST}/${postId}`, {
                withCredentials: true,
            });
            setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.error || "Failed to delete post!");
        }
    };

    // Handle Image Error
    const handleImageError = (e, fallback = img) => {
        console.error('Image failed to load:', e.target.src);
        e.target.src = fallback;
    };

    return (
        <>
            <Sidebar />
            <div className="dashboard-container" style={{ marginLeft: "300px" }}>
                <div className="dashboard-main-content">
                    <div className="dashboard-feed">

                        {/* Stories Section */}
                        <div className="dashboard-story-list">
                            {/* Create Story Button */}
                            <div className="dashboard-story-item" onClick={() => navigate("/createStory")}>
                                <div style={{ 
                                    display: "flex", 
                                    overflowX: "auto", 
                                    padding: "10px", 
                                    border: "1px solid white", 
                                    borderRadius: "50%", 
                                    height: "70px", 
                                    width: "70px" 
                                }}>
                                    <i className="bi bi-plus" style={{ 
                                        position: "relative", 
                                        left: "15px", 
                                        top: "11px", 
                                        height: "40px" 
                                    }}></i>
                                </div>
                                <div className="dashboard-username-label" style={{ position: "relative", top: "7.5px" }}>
                                    Create
                                </div>
                            </div>

                            {/* Stories List */}
                            {stories?.length > 0 && stories.map((story, index) => (
                                story && (
                                    <div
                                        key={story._id || index}
                                        className="dashboard-story-item"
                                        onClick={() => navigate(`/story/${story._id}`)}
                                    >
                                        <div className="dashboard-avatar-circle">
                                            <img
                                                src={story.author?.avatar || img}
                                                className="dashboard-story-img"
                                                alt={story.author?.name || "User"}
                                                onError={(e) => handleImageError(e)}
                                            />
                                        </div>
                                        <div className="dashboard-username-label">
                                            {story?.author?.name || "Unknown User"}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Posts Section */}
                        <div className="dashboard-posts">
                            {posts?.length > 0 ? (
                                posts.map((post, index) => (
                                    post && post.author ? (
                                        <div key={post._id || index} className="dashboard-post-card">
                                            {/* Post Header */}
                                            <div className="dashboard-post-header">
                                                <div className="dashboard-user-info">
                                                    <div className="dashboard-user-avatar">
                                                        <img 
                                                            src={post.author?.avatar || img} 
                                                            alt="User" 
                                                            className="dashboard-story-img"
                                                            onError={(e) => handleImageError(e)}
                                                        />
                                                    </div>
                                                    <div className="dashboard-user-handle">
                                                        {post.author?.username || post.author?.name || "Unknown"}
                                                    </div>
                                                </div>

                                                {/* Delete Menu for Own Posts */}
                                                {post.author?._id === userData?._id && (
                                                    <div style={{ position: "relative" }}>
                                                        <button
                                                            className="dashboard-options-button"
                                                            onClick={() =>
                                                                setMenuOpen(menuOpen === post._id ? null : post._id)
                                                            }
                                                        >
                                                            ⋯
                                                        </button>

                                                        {menuOpen === post._id && (
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    right: 0,
                                                                    top: "100%",
                                                                    background: "black",
                                                                    border: "1px solid #ccc",
                                                                    borderRadius: "10px",
                                                                    padding: "5px 10px",
                                                                    cursor: "pointer",
                                                                    zIndex: 10,
                                                                }}
                                                                onClick={() => handleDelete(post._id)}
                                                            >
                                                                Delete
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Post Media */}
                                            <div className="dashboard-post-media">
                                                {post.media && post.media.length > 0 ? (
                                                    post.media[0].type === 'video' ? (
                                                        <video
                                                            controls
                                                            style={{
                                                                width: '100%',
                                                                maxHeight: '400px',
                                                                borderRadius: '8px'
                                                            }}
                                                            onError={() => console.error('Video failed to load:', post.media[0].url)}
                                                        >
                                                            <source src={post.media[0].url} type="video/mp4" />
                                                            Your browser does not support video.
                                                        </video>
                                                    ) : post.media[0].type === 'image' ? (
                                                        <img
                                                            src={post.media[0].url}
                                                            alt="Post"
                                                            style={{
                                                                width: '100%',
                                                                maxHeight: '400px',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px'
                                                            }}
                                                            onError={(e) => {
                                                                console.error('Post image failed to load:', e.target.src);
                                                                console.log('Original URL:', post.media[0].url);
                                                                e.target.style.display = 'none';
                                                            }}
                                                            onLoad={() => {
                                                                console.log('Post image loaded successfully:', post.media[0].url);
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ 
                                                            padding: '20px', 
                                                            textAlign: 'center',
                                                            background: '#f0f0f0',
                                                            borderRadius: '8px'
                                                        }}>
                                                            <p>Unsupported media type: {post.media[0].type}</p>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div style={{ 
                                                        padding: '20px', 
                                                        textAlign: 'center',
                                                        background: '#f5f5f5',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <p>No media available</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Like, Comment, Caption */}
                                            <div className="dashboard-post-caption">
                                                <span className="dashboard-caption-text">
                                                    <i
                                                        className="bi bi-heart fs-5"
                                                        style={{ cursor: "pointer", marginRight: "20px", color: "red" }}
                                                    ></i>
                                                </span>
                                                <span className="dashboard-caption-text">
                                                    <i className="bi bi-chat fs-5" style={{ cursor: "pointer" }}></i>
                                                </span>
                                                <span className="dashboard-caption-text" style={{ marginLeft: "20px" }}>
                                                    <strong>{post.author?.username || "User"}:</strong> {post.caption || "No caption"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <p>No posts available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="dashboard-right-sidebar">
                        {/* Profile Section */}
                        <div className="dashboard-profile-section">
                            <div className="dashboard-profile-avatar">
                                <img 
                                    src={userData?.avatar || img} 
                                    alt="Profile" 
                                    className="dashboard-profile-img"
                                    onError={(e) => handleImageError(e)}
                                />
                            </div>
                            <div className="dashboard-profile-text">
                                <div className="dashboard-profile-name">
                                    {userData?.email || "User"}
                                </div>
                                <div className="dashboard-profile-username" style={{ color: "green", fontSize: "12px" }}>
                                    {userData?.username || "username"}
                                </div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="dashboard-suggestions-header">
                            <div className="dashboard-suggestions-title">Suggested for you</div>
                            <a href="#" className="dashboard-see-all">See All</a>
                        </div>

                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="dashboard-suggestion">
                                <div className="dashboard-suggestion-user">
                                    <div className="dashboard-suggestion-avatar">
                                        <img 
                                            src={img} 
                                            alt="User" 
                                            className="dashboard-suggestion-img"
                                            onError={(e) => handleImageError(e)}
                                        />
                                    </div>
                                    <div className="dashboard-suggestion-username">beinglalit_0007</div>
                                </div>
                                <button className="dashboard-follow-btn">Follow</button>
                            </div>
                        ))}

                        <div className="dashboard-footer-links">
                            About · Help · Press · API · Jobs · Privacy · Teams · Location · Verified
                        </div>

                        {/* Messages Button */}
                        <div className="dashboard-messages-btn" onClick={() => navigate("/Message")}>
                            <svg className="dashboard-msg-icon" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            Messages
                            <div className="dashboard-settings-icon">⚙️</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;