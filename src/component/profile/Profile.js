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

    return (
        <div className="container" style={{ marginLeft: "-2px" }}>
            <Sidebar />

            <div className="main-content">
                <div className="profile-header">
                    <div className="profile-title">Profile</div>

                    <div className="profile-info">
                        <div className="profile-avatar" style={{ position: "relative", top: "-20px" }}>

                            <img
                                onClick={() => navigate("/profileUpdate")}
                                src={
                                    userData?.profile?.imageName
                                        ? `${End_Points.PROFILE_IMAGE}/${userData.profile.imageName}`
                                        : mahakal
                                }

                                alt="Profile"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    objectFit: "cover"
                                }}
                            />


                        </div>

                        <div className="profile-details">
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
                                    <span className="stat-number">{userData.followers?.length || 455}</span>
                                    <span className="stat-label">followers</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">{userData.following?.length || 400}</span>
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
                            <div className="post" key={post.id || index}>
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;