import { useNavigate } from "react-router-dom";
import img from "./c.jpeg";
import mahakal from "./m.jpg";
import "./Main.css";
import Sidebar from "../Sidebar/Sidebar";
import End_Points, { BASE_URL } from "../../api/End_Points";
import { useEffect, useState } from "react";
import axios from "axios";
import Story from "../Stories/Story";
import { toast } from "react-toastify";

function Main() {
    const userData = JSON.parse(sessionStorage.getItem("Social-User"));
    const nevigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [commentOpen, setCommentOpen] = useState(null);
    const [commentText, setCommentText] = useState({});

    console.log("all posts", posts);

    const groupStoriesByAuthor = (stories) => {
        const grouped = {};

        stories.forEach(story => {
            const authorId = story.author._id;
            if (!grouped[authorId]) {
                grouped[authorId] = {
                    author: story.author,
                    stories: []
                };
            }
            grouped[authorId].stories.push(story);
        });

        return Object.values(grouped);
    };

    // Stories ko group karo
    const groupedStories = groupStoriesByAuthor(stories);



    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(End_Points.GET_STORIES);
                setStories(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch stories!");
            }
        };
        fetchStories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(End_Points.GET_ALL_POST);
                console.log("API response:", response.data);
                setPosts(response.data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                toast.error("Failed to fetch posts!");
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${End_Points.DELETE_POST}/${postId}`, {
                withCredentials: true,
            });

            setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
            toast.success("Post deleted successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to delete post!");
        }
    };

    const handleLike = async (postId) => {
        try {
            // const response = await axios.post((`${BASE_URL}/api/comment/${postId}`),
            const response = await axios.put(`${BASE_URL}/api/like/${postId}`, {}, {
                withCredentials: true
            });

            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post._id === postId) {

                        const isCurrentlyLiked = post.likes?.some(like => like.user === userData._id);
                        return {
                            ...post,
                            likes: isCurrentlyLiked
                                ? post.likes.filter(like => like.user !== userData._id)
                                : [...(post.likes || []), { user: userData._id }]
                        };
                    }
                    return post;
                })
            );

        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error("Failed to like/unlike post!");
        }
    };

    const handleCommentSubmit = async (postId) => {
        const text = commentText[postId];

        if (!text || text.trim() === '') {
            toast.warn('Please enter a comment');
            return;
        }

        try {
            // const response = await axios.post(`http://localhost:3000/api/comment/${postId}`,
            const response = await axios.post((`${BASE_URL}/api/comment/${postId}`),

                { text: text.trim() },
                { withCredentials: true }
            );


            if (response.status === 201) {
                toast.success("Comment added successfully!")

                setCommentText(prev => ({
                    ...prev,
                    [postId]: ''
                }));
                setCommentOpen(null);
            }

        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error(error.response?.data?.error || "Failed to add comment!");
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentText(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const toggleCommentSection = (postId) => {
        setCommentOpen(commentOpen === postId ? null : postId);
    };

    const isLikedByCurrentUser = (post) => {
        return post.likes?.some(like => like.user === userData._id) || false;
    };

    return <>
        <Sidebar />
        <div className="dashboard-container" style={{ marginLeft: "300px" }}>
            <div className="dashboard-main-content">
                <div className="dashboard-feed">

                    <div className="dashboard-story-list">
                        {/* Create story button */}
                        <div className="dashboard-story-item" onClick={() => nevigate("/createStory")}>
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
                            <div className="dashboard-username-label" style={{
                                position: "relative",
                                top: "7.5px"
                            }}>
                                Create
                            </div>
                        </div>

                        {/* Grouped stories render */}
                        {groupedStories.map((userStories, index) => (
                            <div
                                key={userStories.author._id}
                                className="dashboard-story-item"
                                onClick={() => {
                                    // User ID pass karo instead of story ID
                                    nevigate(`/user-stories/${userStories.author._id}`);
                                }}
                            >
                                <div className="dashboard-avatar-circle" style={{ position: 'relative' }}>
                                    <img
                                        src={userStories.author.profilePic || img}
                                        className="dashboard-story-img"
                                        alt={userStories.author.name}
                                    />
                                </div>
                                <div className="dashboard-username-label">
                                    {userStories.author.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-posts">
                        {posts.length > 0 ? (
                            posts.map((post, index) => (
                                <div key={index} className="dashboard-post-card">

                                    <div className="dashboard-post-header">
                                        <div className="dashboard-user-info">
                                            <div className="dashboard-user-avatar">
                                                <img src={img} alt="User" className="dashboard-story-img" />
                                            </div>
                                            <div className="dashboard-user-handle">
                                                {post.author ? post.author.username : "Unknown"}
                                            </div>
                                        </div>

                                        {post.author && post.author._id === userData._id && (
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

                                    {/* Post Image */}
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
                                                />
                                            ) : (
                                                <p>Unsupported media type</p>
                                            )
                                        ) : (
                                            <p>No Media</p>
                                        )}
                                    </div>

                                    {/* Like and Comment Icons */}
                                    <div className="dashboard-post-caption">
                                        <span className="dashboard-caption-text">
                                            <i
                                                className={`bi ${isLikedByCurrentUser(post) ? 'bi-heart-fill' : 'bi-heart'} fs-5`}
                                                style={{
                                                    cursor: "pointer",
                                                    marginRight: "20px",
                                                    color: isLikedByCurrentUser(post) ? "red" : "white",
                                                    transition: "color 0.2s ease"
                                                }}
                                                onClick={() => handleLike(post._id)}
                                            ></i>

                                            {/* Like count */}
                                            <span style={{ fontSize: "14px", position: "relative", left: "-2%", bottom: "3px" }}>
                                                {post.likes?.length || 0}
                                            </span>
                                        </span>

                                        <span className="dashboard-caption-text">
                                            <i
                                                className="bi bi-chat fs-5"
                                                style={{
                                                    cursor: "pointer",
                                                    position: "relative",
                                                    left: "1%",
                                                    top: "-2px",
                                                    marginRight: "20px"
                                                }}
                                                onClick={() => toggleCommentSection(post._id)}
                                            ></i>
                                        </span>

                                        <span className="dashboard-caption-text" style={{ marginLeft: "20px" }}>
                                            {post.caption ? post.caption : "No caption"}
                                        </span>
                                    </div>

                                    {/* Comment Section */}
                                    {commentOpen === post._id && (
                                        <div style={{
                                            padding: "15px",
                                            borderTop: "1px solid #333",
                                            backgroundColor: "#111"
                                        }}>
                                            <textarea
                                                value={commentText[post._id] || ''}
                                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                placeholder="Add a comment..."
                                                style={{
                                                    width: "100%",
                                                    minHeight: "80px",
                                                    padding: "10px",
                                                    backgroundColor: "#222",
                                                    color: "white",
                                                    border: "1px solid #444",
                                                    borderRadius: "8px",
                                                    resize: "vertical",
                                                    fontFamily: "inherit"
                                                }}
                                            />
                                            <div style={{
                                                marginTop: "10px",
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: "10px"
                                            }}>
                                                <button
                                                    onClick={() => setCommentOpen(null)}
                                                    style={{
                                                        padding: "8px 16px",
                                                        backgroundColor: "#666",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleCommentSubmit(post._id)}
                                                    style={{
                                                        padding: "8px 16px",
                                                        backgroundColor: "#0095f6",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No posts found</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-right-sidebar">
                    <div className="dashboard-profile-section">
                        <div className="dashboard-profile-avatar">
                            <img src={img} alt="Profile" className="dashboard-profile-img" />
                        </div>
                        <div className="dashboard-profile-text">
                            <div className="dashboard-profile-name">{userData.email}</div>
                            <div className="dashboard-profile-username" style={{ color: "green", fontSize: "12px" }}>{userData.username}</div>
                        </div>
                    </div>

                    <div className="dashboard-suggestions-header">
                        <div className="dashboard-suggestions-title">Suggested for you</div>
                        <a href="#" className="dashboard-see-all">See All</a>
                    </div>

                    <div className="dashboard-suggestion">
                        <div className="dashboard-suggestion-user">
                            <div className="dashboard-suggestion-avatar">
                                <img src={img} alt="User" className="dashboard-suggestion-img" />
                            </div>
                            <div className="dashboard-suggestion-username">beinglalit_0007</div>
                        </div>
                        <button className="dashboard-follow-btn">Follow</button>
                    </div>

                    <div className="dashboard-suggestion">
                        <div className="dashboard-suggestion-user">
                            <div className="dashboard-suggestion-avatar">
                                <img src={img} alt="User" className="dashboard-suggestion-img" />
                            </div>
                            <div className="dashboard-suggestion-username">beinglalit_0007</div>
                        </div>
                        <button className="dashboard-follow-btn">Follow</button>
                    </div>

                    <div className="dashboard-suggestion">
                        <div className="dashboard-suggestion-user">
                            <div className="dashboard-suggestion-avatar">
                                <img src={img} alt="User" className="dashboard-suggestion-img" />
                            </div>
                            <div className="dashboard-suggestion-username">beinglalit_0007</div>
                        </div>
                        <button className="dashboard-follow-btn">Follow</button>
                    </div>

                    <div className="dashboard-suggestion">
                        <div className="dashboard-suggestion-user">
                            <div className="dashboard-suggestion-avatar">
                                <img src={img} alt="User" className="dashboard-suggestion-img" />
                            </div>
                            <div className="dashboard-suggestion-username">beinglalit_0007</div>
                        </div>
                        <button className="dashboard-follow-btn">Follow</button>
                    </div>

                    <div className="dashboard-footer-links">
                        About · Help · Press · API · Jobs · Privacy · Teams · Location · Verified
                    </div>

                    <div className="dashboard-messages-btn" onClick={() => nevigate("/Message")}>
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
}

export default Main;