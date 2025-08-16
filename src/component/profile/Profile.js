import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";
import pp from "./water.jpeg"
import { useNavigate } from "react-router-dom";
import mahakal from "./m.jpg";
import axios from "axios";
import EditProfile from "../editProfile/EditProfile";
import End_Points from "../../api/End_Points";

function Profile() {
    const navigate = useNavigate();
    const userData = JSON.parse(sessionStorage.getItem("Social-User"));
    console.log("Data", userData.name)

    const [posts, setPosts] = useState([]);
    const [hoveredPost, setHoveredPost] = useState(null);
    console.log("all posts", posts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(End_Points.SINGLE_POST, {
                    withCredentials: true
                });
                console.log(response.data.posts);
                setPosts(response.data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const handleLogOut = () => {
        sessionStorage.setItem("Social-User", "");
        sessionStorage.clear();
        navigate("/");
    }

    // Like functionality
    const handleLike = async (postId, event) => {
        event.stopPropagation(); // Prevent any parent click handlers
        try {
            const response = await axios.put(`http://localhost:3000/api/like/${postId}`, {}, {
                withCredentials: true
            });

            // Update the posts state to reflect the like change
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
            alert("Failed to like/unlike post!");
        }
    };

    // Check if current user has liked the post
    const isLikedByCurrentUser = (post) => {
        return post.likes?.some(like => like.user === userData._id) || false;
    };

    // Function to get first letter of name for default avatar
    const getInitials = (name) => {
        if (!name) return "U"; // Default to "U" for User if no name
        return name.charAt(0).toUpperCase();
    };

    // Function to generate background color based on name
    const getAvatarColor = (name) => {
        if (!name) return "#6B7280"; // Default gray color

        const colors = [
            "#EF4444", "#F97316", "#F59E0B", "#EAB308",
            "#84CC16", "#22C55E", "#10B981", "#14B8A6",
            "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
            "#8B5CF6", "#A855F7", "#D946EF", "#EC4899"
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    // Profile Avatar Component
    const ProfileAvatar = () => {
        const hasProfileImage = userData?.profile?.imageName;

        if (hasProfileImage) {
            return (
                <img
                    onClick={() => navigate("/profileUpdate")}
                    src={`${End_Points.PROFILE_IMAGE}/${userData.profile.imageName}`}
                    alt="Profile"
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        objectFit: "cover"
                    }}
                />
            );
        }

        // Default avatar with first letter
        return (
            <div
                onClick={() => navigate("/profileUpdate")}
                style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: getAvatarColor(userData?.name),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "white",
                    userSelect: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
            >
                {getInitials(userData?.name)}
            </div>
        );
    };

    return <>
        <Sidebar />

        <div className="main-content " style={{ width: "80vw", marginLeft: "10%", marginTop: "-11px", height: "94vh" }}>
            <div className="profile-header" style={{ marginTop: "-16px" }}>
                <div className="profile-title">Profile</div>

                <div className="profile-info">
                    <div className="profile-avatar" style={{ position: "relative", top: "20px" }}>
                        <ProfileAvatar />
                    </div>

                    <div className="profile-details" style={{ width: "5%" }}>
                        <div className="username-section">
                            <h2 className="username">{userData.username}</h2>
                            <button className="edit-btn" onClick={() => navigate("/EditProfile")}>
                                Edit profile
                            </button>
                            <button
                                className="edit-btn"
                                onClick={handleLogOut}
                                style={{ backgroundColor: "#443736" }}
                            >
                                LogOut
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="stats">
                            <div className="stat">
                                <span className="stat-number">{posts.length || 0}</span>
                                <span className="stat-label">posts</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{userData.followers?.length || 0}</span>
                                <span className="stat-label">followers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{userData.following?.length || 0}</span>
                                <span className="stat-label">following</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bio">
                            <div className="name">{userData.name}</div>
                            <div className="description">{userData.bio || "bio Coding  ZZZ..😊"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="Posts-header">
                <div className="AllPost">
                    {posts.map((post, index) => (
                        <div
                            className="post"
                            key={post._id || index}
                            onMouseEnter={() => setHoveredPost(post._id)}
                            onMouseLeave={() => setHoveredPost(null)}
                            style={{ position: 'relative', cursor: 'pointer' }}
                        >
                            {post.media && post.media.length > 0 ? (
                                post.media[0].type === 'video' ? (
                                    <video
                                        controls
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <source src={post.media[0].url} type="video/mp4" />
                                        Your browser does not support video.
                                    </video>
                                ) : (
                                    <img
                                        src={post.media[0].url}
                                        alt={`Post ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                )
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    color: '#666'
                                }}>
                                    No Media
                                </div>
                            )}

                            {/* Hover Overlay with Like Button */}
                            {hoveredPost === post._id && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '20px',
                                            color: 'white',
                                            fontSize: '18px'
                                        }}
                                    >
                                        {/* Like Icon and Count */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => handleLike(post._id, e)}
                                        >
                                            <i
                                                className={`bi ${isLikedByCurrentUser(post) ? 'bi-heart-fill' : 'bi-heart'}`}
                                                style={{
                                                    fontSize: '24px',
                                                    color: isLikedByCurrentUser(post) ? '#ff3040' : 'white'
                                                }}
                                            ></i>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {post.likes?.length || 0}
                                            </span>
                                        </div>

                                        {/* Comments Icon (optional) */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <i
                                                className="bi bi-chat"
                                                style={{ fontSize: '24px' }}
                                            ></i>
                                            <span style={{ fontWeight: 'bold' }}>
                                                {post.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

export default Profile;