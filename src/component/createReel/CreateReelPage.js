import React, { useState, useEffect } from "react";
import axios from "axios";
import myImage from "./m.jpg";
import "./CreateReel.css";
import { BASE_URL } from "../../api/End_Points";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateReel() {
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('Social-User') || '{}');

        if (userData && userData._id) {
          setUser(userData);
          setLoading(false);
        } else {
          const response = await axios.get(`${BASE_URL}/user/profile`, {
            withCredentials: true
          });

          if (response.data.userProfile) {
            setUser(response.data.userProfile);
            sessionStorage.setItem('Social-User', JSON.stringify(response.data.userProfile));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Please login again");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) {
      toast.error("Please select a video file");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("video", video);

      const response = await axios.post(`${BASE_URL}/reel/reels`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Reel uploaded successfully!");
        navigate("/reel");
        setDescription("");
        setVideo(null);
        document.getElementById("video-upload").value = "";
      }
    } catch (error) {
      console.error("Error uploading reel:", error);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/login");
      } else {
        toast.error("Failed to upload reel");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="create-reel-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // User profile image path
  const getUserProfileImage = () => {
    if (user?.profile?.imageName) {
      return `${BASE_URL}/profile/${user.profile.imageName}`;
    }
    return myImage;
  };

  return (
    <div className="create-reel-container">
      <h2 className="create-reel-title" style={{ position: "relative", left: "-25%" }}>
        Create Reel
      </h2>
      <p className="create-reel-subtitle" style={{ position: "relative", left: "-25%" }}>
        Share your moments with friends
      </p>

      <div className="create-reel-card">
        <div className="create-reel-user-info">
          <img
            src={getUserProfileImage()}
            alt="User"
            className="create-reel-user-avatar"
            onError={(e) => {
              e.target.src = myImage;
            }}
          />
          <div>
            <h4 className="create-reel-user-name">
              {user?.name || 'User'}
            </h4>
            <p className="create-reel-user-email">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="create-reel-input"
            placeholder="Write a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="create-reel-actions">
            <label htmlFor="video-upload" className="create-reel-upload-icon">
              <i className="bi bi-camera-reels"></i>
              {video && (
                <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                  {video.name}
                </span>
              )}
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              style={{ display: "none" }}
              required
            />

            <button type="submit" className="create-reel-btn">
              Post Reel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateReel;
