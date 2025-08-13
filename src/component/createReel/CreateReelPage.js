import React, { useState } from "react";
import axios from "axios";
import myImage from "./m.jpg"
import "./CreateReel.css"
import { BASE_URL } from "../../api/End_Points";

function CreateReel() {
    const [description, setDescription] = useState("");
    const [video, setVideo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!video) {
            alert("Please select a video file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", description);
            formData.append("videoUrl", video);

            const response = await axios.post(`${BASE_URL}/reels`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            alert("Reel uploaded successfully!");
            setDescription("");
            setVideo(null);
        } catch (error) {
            console.error("Error uploading reel:", error);
            alert("Failed to upload reel");
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
                    // style={{ borderRadius: "50%" }}
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
                    />

                    <div className="actions-row">
                        <label htmlFor="video-upload" className="upload-icon">
                            <i class="bi bi-camera-reels"></i>
                        </label>
                        <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files[0])}
                            style={{ display: "none" }}
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
