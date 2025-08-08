import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../profile/m.jpg"

function Story() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const fetchStory = async () => {
            console.log("Fetching story for ID:", id);
            try {
                const res = await fetch(`http://localhost:3000/story/stories/${id}`);
                const data = await res.json();
                console.log("Story data:", data);
                setStory(data);

                const duration = data?.media?.duration || 15;
                setTimeLeft(duration);
            } catch (err) {
                console.error("Error fetching story:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStory();
        }
    }, [id]);

    useEffect(() => {
        if (!story || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const newTime = prev - 1;
                const duration = story?.media?.duration || 15;
                setProgress((newTime / duration) * 100);

                if (newTime <= 0) {
                    navigate(-1);
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [story, timeLeft, navigate]);

    const handleImageError = (e) => {
        console.error("Image failed to load:", e.target.src);
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log("Image loaded successfully");
        setImageError(false);
    };

    const handleClose = () => {
        navigate(-1);
    };

    if (loading) return <div style={{ color: 'white' }}>Loading...</div>;
    if (!story) return <div style={{ color: 'white' }}>Story not found</div>;

    const imageUrl = story?.media?.url
        ? `http://localhost:3000${story.media.url}`
        : "";

    // const profileUrl = story?.author?.profile?.imageName
    //     ? `http://localhost:3000/${story.author.profile.imageName}`
    //     : `https://ui-avatars.com/api/?name=${story?.author?.name || story?.author?.username}&background=007bff&color=fff`;

    // console.log("Image URL:", imageUrl);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                right: '20px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'white',
                    transition: 'width 1s linear'
                }}></div>
            </div>

            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ×
            </button>

            <div style={{
                position: 'absolute',
                top: '30px',
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'white'
            }}>
                <img
                    src={userProfile}
                    alt={story.author?.username}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        objectFit: 'cover'
                    }}
                />

                <div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '2px'
                    }}>
                        {story.author?.username}
                    </div>
                    <div style={{
                        fontSize: '12px',
                        opacity: 0.8
                    }}>
                        {timeLeft}s
                    </div>
                </div>
            </div>


            <div onClick={handleClose} style={{ cursor: 'pointer' }}>
                <img
                    src={imageUrl}
                    alt="Story"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    style={{
                        maxWidth: '80vw',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        borderRadius: '10px'
                    }}
                />
            </div>


            <div style={{
                position: 'absolute',
                bottom: '30px',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px'
            }}>
                Tap anywhere to close
            </div>
        </div>
    );
}

export default Story;