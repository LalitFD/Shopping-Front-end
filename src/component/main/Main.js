import { useNavigate } from "react-router-dom";
import img from "./c.jpeg";
import "./Main.css";
import Sidebar from "../Sidebar/Sidebar";
import End_Points from "../../api/End_Points";
import { useEffect, useState } from "react";
import axios from "axios";
function Main() {

    const userData = JSON.parse(sessionStorage.getItem("Social-User"));

    const nevigate = useNavigate();
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get(End_Points.GET_STORIES);
                setStories(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStories();
    }, []);



    const [posts, setPosts] = useState([]);
    console.log("all posts", posts);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(End_Points.GET_ALL_POST);
                console.log("API response:", response.data);
                setPosts(response.data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const [menuOpen, setMenuOpen] = useState(null);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${End_Points.DELETE_POST}/${postId}`, {
                withCredentials: true,
            });

            setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Failed to delete post!");
        }
    };


    return <>
        <Sidebar />
        <div className="dashboard-container" style={{ marginLeft: "300px" }}>
            <div className="dashboard-main-content">
                <div className="dashboard-feed">


                    <div className="dashboard-story-list">

                        <div className="dashboard-story-item" onClick={() => nevigate("/createStory")}>

                            <div style={{ display: "flex", overflowX: "auto", padding: "10px", border: "1px solid white", borderRadius: "50%", height: "70px", width: "70px" }}>

                                <i className="bi bi-plus" style={{ position: "relative", left: "15px", top: "11px", height: "40px" }}></i>
                            </div>
                            <div className="dashboard-username-label" style={{ position: "relative", top: "7.5px" }}>
                                Create
                            </div>
                        </div>




                        {/* --------------------------------------------------------------------------------------------------------------------------- */}

                        {stories?.map((story, index) => (
                            <div
                                key={story?._id}
                                className="dashboard-story-item"
                                onClick={() => nevigate(`/story/${story?._id}`)}
                            >
                                <div className="dashboard-avatar-circle">
                                    <img
                                        src={img}
                                        className="dashboard-story-img"
                                        alt={story.author.name}
                                    />
                                </div>
                                <div className="dashboard-username-label">
                                    {story?.author?.name}
                                </div>
                            </div>
                        ))}

                        {/* --------------------------------------------------------------------------------------------------------------------------- */}



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
                                                className="bi bi-heart fs-5"
                                                style={{ cursor: "pointer", marginRight: "20px", color: "red" }}
                                            ></i>
                                        </span>
                                        <span className="dashboard-caption-text">
                                            <i className="bi bi-chat fs-5" style={{ cursor: "pointer" }}></i>
                                        </span>
                                        <span className="dashboard-caption-text" style={{ marginLeft: "20px" }}>
                                            {post.caption ? post.caption : "No caption"}
                                        </span>
                                    </div>
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