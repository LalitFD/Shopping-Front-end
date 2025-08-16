import React, { useState } from "react";
import axios from "axios";
import myImage from "./m.jpg"
import "./CreateReel.css"
import { BASE_URL } from "../../api/End_Points";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateReel() {
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);

    const nevigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!video) {
            alert("Please select a video file");
            return;
        }

        if (!description.trim()) {
            alert("Please enter a description");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("video", video);

            const response = await axios.post(`${BASE_URL}/reel/reels`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            });

            if (response.data.success) {
                toast.success("Reel uploaded successfully!");
                nevigate("/reel")
                setDescription("");
                setVideo(null);
                document.getElementById('video-upload').value = '';
            }
        } catch (error) {
            console.error("Error uploading reel:", error);

            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Failed to upload reel");
            }
        }
    };

    return (
        <div className="create-post-container">
            <h2 className="page-title" style={{ position: "relative", left: "-25%" }}>Create Reel</h2>
            <p className="page-subtitle" style={{ position: "relative", left: "-25%" }}>Share your moments with friends</p>

            <div className="post-card">
                <div className="user-info">
                    <img
                        src={myImage}
                        alt="User"
                        className="user-avatar"
                    />
                    <div>
                        <h4 className="user-name">Lalit Doriya</h4>
                        <p className="user-email">doriyalalit8@gmail.com</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="post-input"
                        placeholder="Write a description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <div className="actions-row">
                        <label htmlFor="video-upload" className="upload-icon">
                            <i className="bi bi-camera-reels"></i>
                            {video && <span style={{ marginLeft: '8px', fontSize: '12px' }}>
                                {video.name}
                            </span>}
                        </label>
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files[0])}
                            style={{ display: "none" }}
                            required
                        />

                        <button type="submit" className="post-btn">
                            Post Reel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateReel;