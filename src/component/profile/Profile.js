import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";
import pp from "./water.jpeg"
import { useNavigate } from "react-router-dom";
import mahakal from "./m.jpg";
import axios from "axios";
import EditProfile from "../editProfile/EditProfile";

function Profile() {
    const navigate = useNavigate();

    const userData = JSON.parse(sessionStorage.getItem("Social-User"));
    console.log("Data", userData.name)

    const [posts, setPosts] = useState([]);
    console.log("all posts", posts);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/getPost", {
                withCredentials: true // cookie/session ke liye zaruri
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
                                src={mahakal}
                                alt="Profile"
                                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
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
                                <img
                                    src={post.media?.[0]?.url}
                                    alt={`Post ${index + 1}`}
                                />
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;