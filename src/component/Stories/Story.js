import React from "react";
import "./Story.css";
const BASE_URL = "http://localhost:3000";


function Story({ story, onClose }) {
    if (!story) return null;

    return (
        <div className="story-overlay">
            <div className="story-box">
                <div className="story-header">
                    <span className="story-username">{story.author.name}</span>
                    <span className="close-btn" onClick={onClose}>
                        &times;
                    </span>
                </div>

                <div className="story-media">
                    {story.media.type.replace(/"/g, "") === "image" ? (
                        <img
                            src={`http://localhost:3000${story.media.url}`}
                            alt="story"
                            className="story-img"
                        />

                    ) : (
                        <video
                            src={`http://localhost:3000${story.media.url}`}
                            className="story-video"
                            autoPlay
                            controls
                        />

                    )}
                </div>
            </div>
        </div>
    );
}

export default Story;
