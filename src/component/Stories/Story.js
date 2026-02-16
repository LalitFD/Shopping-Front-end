import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userProfile from "../profile/m.jpg"
import End_Points, { BASE_URL } from "../../api/End_Points";
import axios from "axios";
import { toast } from "react-toastify";

function Story() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userStories, setUserStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(100);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem("Social-User") || "{}");

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/story/stories/user/${userId}`);
        const data = await res.json();

        if (data.length > 0) {
          setUserStories(data);
          const duration = data[0]?.media?.duration || 15;
          setTimeLeft(duration);
        }
      } catch (err) {
        console.error("Error fetching user stories:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserStories();
    }
  }, [userId]);

  const currentStory = userStories[currentStoryIndex];

  useEffect(() => {
    if (!currentStory || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        const duration = currentStory?.media?.duration || 15;
        setProgress((newTime / duration) * 100);

        if (newTime <= 0) {
          if (currentStoryIndex < userStories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            const nextDuration = userStories[currentStoryIndex + 1]?.media?.duration || 15;
            setTimeLeft(nextDuration);
            setProgress(100);
          } else {
            navigate(-1);
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStory, timeLeft, navigate, currentStoryIndex, userStories]);

  // Delete story function
  const handleDeleteStory = async () => {
    if (!currentStory?._id) {
      toast.error("Story ID not found!");
      return;
    }

    // Check if current user owns this story
    if (currentStory?.author?._id !== userData?._id) {
      toast.error("You can only delete your own stories!");
      return;
    }
    try {
      const deleteUrl = `${BASE_URL}/story/stories/${currentStory._id}`;

      const response = await axios.delete(deleteUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token || sessionStorage.getItem('token') || ''}`,
        }
      });
      toast.success("Story deleted successfully!");

      const updatedStories = userStories.filter(story => story._id !== currentStory._id);

      if (updatedStories.length === 0) {
        navigate(-1);
        return;
      }

      setUserStories(updatedStories);

      if (currentStoryIndex >= updatedStories.length) {
        setCurrentStoryIndex(updatedStories.length - 1);
      }

      const duration = updatedStories[currentStoryIndex]?.media?.duration || 15;
      setTimeLeft(duration);
      setProgress(100);
      setShowDeleteConfirm(false);

    } catch (error) {
      console.error("Error deleting story:", error);

      if (error.response?.status === 404) {
        toast.error("Story not found!");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed! Please login again.");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this story!");
      } else {
        toast.error(error.response?.data?.error || "Failed to delete story!");
      }
      setShowDeleteConfirm(false);
    }
  };

  // Navigation functions
  const goToNextStory = () => {
    if (currentStoryIndex < userStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      const nextDuration = userStories[currentStoryIndex + 1]?.media?.duration || 15;
      setTimeLeft(nextDuration);
      setProgress(100);
      setImageError(false);
    } else {
      navigate(-1);
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      const prevDuration = userStories[currentStoryIndex - 1]?.media?.duration || 15;
      setTimeLeft(prevDuration);
      setProgress(100);
      setImageError(false);
    }
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleLeftClick = (e) => {
    e.stopPropagation();
    goToPrevStory();
  };

  const handleRightClick = (e) => {
    e.stopPropagation();
    goToNextStory();
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50vh' }}>Loading...</div>;
  if (!userStories.length) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50vh' }}>No stories found</div>;

  const imageUrl = currentStory?.media?.url;
  const isCloudinaryUrl = imageUrl?.startsWith('https://res.cloudinary.com/');
  const finalImageUrl = isCloudinaryUrl ? imageUrl : `${BASE_URL}${imageUrl}`;

  // Check if current user owns this story
  const canDeleteStory = currentStory?.author?._id === userData?._id;

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
      {/* Progress bars */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '20px',
        right: '20px',
        display: 'flex',
        gap: '4px'
      }}>
        {userStories.map((_, index) => (
          <div key={index} style={{
            flex: 1,
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: index < currentStoryIndex ? '100%' :
                index === currentStoryIndex ? `${progress}%` : '0%',
              height: '100%',
              backgroundColor: 'white',
              transition: index === currentStoryIndex ? 'width 1s linear' : 'width 0.3s ease'
            }}></div>
          </div>
        ))}
      </div>

      {/* Top controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 1001
      }}>
        {/* Delete Button - Only show if user owns the story */}
        {canDeleteStory && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              // background: 'rgba(255, 0, 0, 0.7)',
              border: 'none',
              // color: 'white',
              fontSize: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <i class="bi bi-trash"></i>
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
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
      </div>

      {/* User Info */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'white',
        zIndex: 1001
      }}>
        <img
          src={currentStory?.author?.profilePic || userProfile}
          alt={currentStory?.author?.username || "User"}
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
            {currentStory?.author?.username || currentStory?.author?.name || "Unknown User"}
          </div>
          <div style={{
            fontSize: '12px',
            opacity: 0.8
          }}>
            {currentStoryIndex + 1} of {userStories.length} • {timeLeft}s
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '300px',
            border: '1px solid #333'
          }}>
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>
              Delete Story?
            </h3>
            <p style={{ color: '#a3a3a3', marginBottom: '25px', fontSize: '14px' }}>
              This action cannot be undone. Are you sure you want to delete this story?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStory}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation areas */}
      <div
        onClick={handleLeftClick}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '30%',
          height: '100%',
          cursor: currentStoryIndex > 0 ? 'pointer' : 'default',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '20px'
        }}
      >
        {currentStoryIndex > 0 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            opacity: 0.7
          }}>
            ‹
          </div>
        )}
      </div>

      <div
        onClick={handleRightClick}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '30%',
          height: '100%',
          cursor: currentStoryIndex < userStories.length - 1 ? 'pointer' : 'default',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '20px'
        }}
      >
        {currentStoryIndex < userStories.length - 1 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            opacity: 0.7
          }}>
            ›
          </div>
        )}
      </div>

      {/* Story Media */}
      <div style={{
        cursor: 'pointer',
        position: 'relative',
        zIndex: 998
      }}>
        {currentStory?.media?.type === 'video' ? (
          <video
            src={finalImageUrl}
            autoPlay
            // muted
            style={{
              maxWidth: '80vw',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '10px'
            }}
            onError={(e) => {
              console.error("Video failed to load:", e.target.src);
              setImageError(true);
            }}
          />
        ) : (
          <>
            {!imageError ? (
              <img
                src={finalImageUrl}
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
            ) : (
              <div style={{
                width: '300px',
                height: '400px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
              }}>
                <div>
                  <p>Failed to load story</p>
                  <p style={{ fontSize: '12px', opacity: 0.7 }}>
                    URL: {finalImageUrl}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '30px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        {/* Tap sides to navigate */}
      </div>
    </div>
  );
}

export default Story;