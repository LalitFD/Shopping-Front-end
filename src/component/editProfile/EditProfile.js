import { useState, useEffect } from "react";
import "./EditProfile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import End_Points from "../../api/End_Points";

function EditProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("Social-User") || "{}");
        if (userData) {
            setName(userData.name || "");
            setUsername(userData.username || "");
            setBio(userData.bio || "");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required!");
            return;
        }

        if (!username.trim()) {
            toast.error("Username is required!");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(
                End_Points.EDIT_PROFILE,
                { name: name.trim(), username: username.trim(), bio: bio.trim() },
                { withCredentials: true }
            );

            const updatedUser = res.data.updatedUser;
            sessionStorage.setItem("Social-User", JSON.stringify(updatedUser));

            toast.success("Profile Updated Successfully!");
            
            // Navigate after a short delay to show the success message
            setTimeout(() => {
                navigate("/profile");
            }, 1500);

            console.log("Updated Profile:", updatedUser);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    return (
        <div className="editprofile-page-wrapper">
            <div className="editprofile-container">
                <div className="editprofile-header">
                    <button 
                        className="editprofile-back-btn"
                        onClick={handleCancel}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h1 className="editprofile-title">Edit Profile</h1>
                    <div className="editprofile-spacer"></div>
                </div>
        
                <form className="editprofile-form" onSubmit={handleSubmit}>
                    <div className="editprofile-form-group">
                        <label htmlFor="name" className="editprofile-label">
                            <i className="bi bi-person-fill editprofile-label-icon"></i>
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="editprofile-input"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="editprofile-form-group">
                        <label htmlFor="username" className="editprofile-label">
                            <i className="bi bi-at editprofile-label-icon"></i>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="editprofile-input"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="editprofile-form-group">
                        <label htmlFor="bio" className="editprofile-label">
                            <i className="bi bi-chat-text-fill editprofile-label-icon"></i>
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="editprofile-textarea"
                            placeholder="Tell something about yourself..."
                            rows="4"
                        ></textarea>
                        <span className="editprofile-char-count">
                            {bio.length}/150
                        </span>
                    </div>

                    <div className="editprofile-form-actions">
                        <button
                            type="button"
                            className="editprofile-cancel-btn"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="editprofile-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="editprofile-loading">
                                    <div className="editprofile-spinner"></div>
                                    Updating...
                                </span>
                            ) : (
                                <span>
                                    <i className="bi bi-check-lg"></i>
                                    Save Changes
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                <ToastContainer 
                    position="top-center" 
                    autoClose={3000} 
                    hideProgressBar={false}
                    theme="dark"
                    style={{ zIndex: 9999 }}
                />
            </div>
        </div>
    );
}

export default EditProfile;