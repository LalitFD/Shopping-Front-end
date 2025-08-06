import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Creat-Post.css";
import m from "./m.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function CreatePost() {

    const navigate = useNavigate();

    const userData = JSON.parse(sessionStorage.getItem("Social-User"));

    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState(null);

    const handleFileChange = (e) => {
        setMedia(e.target.files[0]);
    };


    const handleSubmit = async () => {
        if (!media || !caption) {
            toast.warn("Please select an image and enter caption!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("media", media);
            formData.append("caption", caption);

            const res = await axios.post(
                "http://localhost:3000/api/createPost",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Post Created Successfully!");
            console.log("Created Post:", res.data.post);
            setCaption("");
            setMedia(null);
            // naviagte("/Main");
            navigate("/Main");

            // window.location.reload();


        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Something went wrong!");
        }
    };


    return (
        <div className="container">
            <div className="container" style={{ marginLeft: "-400px" }}>
                <Sidebar />
            </div>

            <div className="create-post-container">
                <h2 className="create-post-title">Create Post</h2>
                <p className="create-post-subtitle">Share your thoughts with your friends</p>

                <div className="create-post-card">
                    {/* Profile Info */}
                    <div className="profile-info">
                        <img src={m} alt="Profile" className="profile-img" />
                        <div>
                            <h3 className="profile-name">{userData.name}</h3>
                            <p className="profile-username">{userData.email}</p>
                        </div>
                    </div>

                    {/* Caption Input */}
                    <textarea
                        className="post-input"
                        placeholder="Write Something?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>

                    {/* Bottom row */}
                    <div className="post-actions">
                        <label htmlFor="file-upload" className="upload-icon">
                            <i className="bi bi-image"></i>
                        </label>
                        <input type="file" id="file-upload" hidden onChange={handleFileChange} />

                        <button className="publish-btn" onClick={handleSubmit}>Post Image</button>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default CreatePost;
