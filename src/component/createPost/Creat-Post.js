import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Creat-Post.css";
import m from "./m.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import End_Points from "../../api/End_Points";

function CreatePost() {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("Social-User"));

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image or video file!");
        return;
      }
      setMedia(file);
    }
  };

  const handleSubmit = async () => {
    if (!media) {
      toast.warn("Please select a media file!");
      return;
    }
    if (!caption.trim()) {
      toast.warn("Please enter a caption!");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("media", media);
      formData.append("caption", caption.trim());

      const res = await axios.post(End_Points.CREATE_POST, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });

      toast.success("Post Created Successfully!");
      setCaption("");
      setMedia(null);
      document.getElementById("file-upload").value = "";
      navigate("/Main");

    } catch (err) {
      console.error("Error creating post:", err);

      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.error || "Invalid request data");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(err.response?.data?.error || "Something went wrong!");
      }
    } finally {
      setLoading(false);
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
              <h3 className="profile-name">{userData?.name}</h3>
              <p className="profile-username">{userData?.email}</p>
            </div>
          </div>

          {/* Caption Input */}
          <textarea
            className="post-input"
            placeholder="Write Something?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={loading}
          ></textarea>

          {/* Selected file preview */}
          {media && (
            <div className="file-preview">
              <p>Selected: {media.name}</p>

              <button
                onClick={() => {
                  setMedia(null);
                  document.getElementById("file-upload").value = "";
                }}
                className="remove-file-btn"
              >
                Remove
              </button>

              {/* 
              <Button
                label="Remove"
                onClick={() => {
                  setMedia(null);
                  document.getElementById("file-upload").value = "";
                }} className="remove-file-btn" /> */}
            </div>
          )}

          {/* Bottom row */}
          <div className="post-actions">
            <label htmlFor="file-upload" className="upload-icon">
              <i className="bi bi-image"></i>
            </label>
            <input
              type="file"
              id="file-upload"
              hidden
              onChange={handleFileChange}
              accept="image/*,video/*"
              disabled={loading}
            />

            <button
              className="publish-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Image"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default CreatePost;
