import React from "react";
import "./Story.css";
import End_Points from "../../api/End_Points";
const BASE_URL = End_Points.BASE_URL;


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
                            src={`${BASE_URL}${story.media.url}`}
                            alt="story"
                            className="story-img"
                        />


                    ) : (
                        <video
                            src={`${BASE_URL}${story.media.url}`}
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
