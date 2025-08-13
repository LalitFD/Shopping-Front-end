import React, { useState, useRef, useEffect } from 'react';
import { Play, Heart, MessageCircle, Share, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/End_Points';

const ReelsComponent = () => {
  const navigate = useNavigate();
  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/reel/reels`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setReelsData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  // Play/pause current video
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play().catch(console.error);
      } else {
        currentVideo.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  // Pause other videos when switching
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const deltaY = startY.current - currentY.current;
    const threshold = 50;

    if (deltaY > threshold && currentIndex < reelsData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (deltaY < -threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    isDragging.current = false;
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
        break;
      case 'ArrowDown':
        if (currentIndex < reelsData.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
        break;
      case ' ':
        e.preventDefault();
        setIsPlaying(prev => !prev);
        break;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.muted = !isMuted;
    }
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
  };

  // Loading state
  if (loading) {
    return (
      <div className="reels-loading-container">
        <div className="reels-loading-content">
          <div className="reels-spinner"></div>
          <p className="reels-loading-text">Loading Reels...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="reels-error-container">
        <div className="reels-error-content">
          <p className="reels-error-title">Error loading reels:</p>
          <p className="reels-error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="reels-retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (!reelsData || reelsData.length === 0) {
    return (
      <div className="reels-empty-container">
        <div className="reels-empty-content">
          <p className="reels-empty-text">No reels available</p>
        </div>
      </div>
    );
  }

  const currentReel = reelsData[currentIndex];

  return (
    <>
      <style>
        {`


 .reels-back-btn {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    background-color: rgba(0,0,0,0.6);
                    border: none;
                    border-radius: 50%;
                    padding: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease;
                    z-index: 2000;
                  }
                  .reels-back-btn:hover {
                    background-color: rgba(0,0,0,0.8);
                  }

          .reels-main-container {
            width: 100%;
            height: 100vh;
            background-color: #000;
            position: relative;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .reels-video-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            outline: none;
          }

          .reels-video-element {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-color: #000;
          }

          .reels-play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .reels-play-button {
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .reels-actions-sidebar {
            position: absolute;
            right: 16px;
            bottom: 120px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .reels-action-btn {
            background-color: rgba(0, 0, 0, 0.4);
            border: none;
            border-radius: 50%;
            padding: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .reels-action-btn:hover {
            background-color: rgba(0, 0, 0, 0.6);
            transform: scale(1.1);
          }

          .reels-bottom-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 80px;
            padding: 24px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          }

          .reels-info-content {
            color: white;
          }

          .reels-creator-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            display: block;
          }

          .reels-description {
            font-size: 16px;
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .reels-date {
            font-size: 14px;
            color: #ccc;
          }

          .reels-navigation-dots {
            position: absolute;
            top: 16px;
            right: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .reels-dot {
            width: 8px;
            height: 32px;
            border-radius: 4px;
            transition: all 0.3s ease;
          }

          .reels-dot-active {
            background-color: white;
          }

          .reels-dot-inactive {
            background-color: #666;
          }

          .reels-instructions {
            position: absolute;
            top: 16px;
            left: 16px;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 8px 12px;
            border-radius: 8px;
          }

          .reels-instructions-text {
            color: white;
            font-size: 12px;
            margin: 0;
          }

          .reels-nav-controls {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 16px;
          }

          .reels-nav-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .reels-nav-btn:enabled {
            background-color: white;
            color: black;
          }

          .reels-nav-btn:enabled:hover {
            background-color: #f0f0f0;
          }

          .reels-nav-btn:disabled {
            background-color: #666;
            color: #999;
            cursor: not-allowed;
          }

          .reels-loading-container, .reels-error-container, .reels-empty-container {
            width: 100%;
            height: 100vh;
            background-color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .reels-loading-content, .reels-error-content, .reels-empty-content {
            text-align: center;
            color: white;
          }

          .reels-spinner {
            width: 48px;
            height: 48px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: reels-spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          @keyframes reels-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .reels-loading-text {
            margin: 0;
            font-size: 16px;
          }

          .reels-error-title {
            color: #ff6b6b;
            margin-bottom: 8px;
            font-size: 16px;
          }

          .reels-error-message {
            font-size: 14px;
            margin-bottom: 16px;
          }

          .reels-retry-btn {
            background-color: white;
            color: black;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }

          .reels-retry-btn:hover {
            background-color: #f0f0f0;
          }

          .reels-empty-text {
            font-size: 16px;
            margin: 0;
          }

          .reels-like-active {
            color: #ff3040 !important;
            fill: #ff3040;
          }

          .reels-like-inactive {
            color: white;
          }

.reels-create-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: #ff3040;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-weight: bold;
  width:"10px",
  height:"10px"
  cursor: pointer;
  z-index: 2000;
  transition: background-color 0.2s ease;
}
.reels-create-btn:hover {
  background-color: #e02435;
}


        `}
      </style>

      <div className="reels-main-container">
        {/* 🔹 Back Button */}
        <button className="reels-back-btn" onClick={() => navigate('/Main')}>
          <ArrowLeft size={24} color="white" />
        </button>


        <button
          className="reels-create-btn"
          onClick={() => navigate('/create-reel')}
        >
          + Create Reel
        </button>

        <div
          className="reels-video-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          ref={containerRef}
        >
          <video
            ref={el => videoRefs.current[currentIndex] = el}
            src={currentReel.videoUrl}
            className="reels-video-element"
            loop
            muted={isMuted}
            playsInline
            autoPlay
            onError={() => console.error(`Error loading video: ${currentReel.videoUrl}`)}
          />

          <div className="reels-play-overlay" onClick={togglePlayPause}>
            {!isPlaying && (
              <div className="reels-play-button">
                <Play size={64} color="white" fill="white" />
              </div>
            )}
          </div>

          <div className="reels-actions-sidebar">
            <button onClick={toggleLike} className="reels-action-btn">
              <Heart
                size={24}
                className={isLiked ? 'reels-like-active' : 'reels-like-inactive'}
              />
            </button>

            <button className="reels-action-btn">
              <MessageCircle size={24} color="white" />
            </button>

            <button className="reels-action-btn">
              <Share size={24} color="white" />
            </button>

            <button onClick={toggleMute} className="reels-action-btn">
              {isMuted ? (
                <VolumeX size={24} color="white" />
              ) : (
                <Volume2 size={24} color="white" />
              )}
            </button>
          </div>

          {/* Bottom Info */}
          <div className="reels-bottom-info">
            <div className="reels-info-content">
              <span className="reels-creator-name">{currentReel.createdBy.name}</span>
              <p className="reels-description">{currentReel.description.replace(/"/g, '')}</p>
              <div className="reels-date">
                {new Date(currentReel.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Navigation Dots
                    <div className="reels-navigation-dots">
                        {reelsData.map((_, index) => (
                            <div
                                key={index}
                                className={`reels-dot ${index === currentIndex ? 'reels-dot-active' : 'reels-dot-inactive'
                                    }`}
                            />
                        ))}
                    </div> */}

          {/* Navigation Controls */}
          <div className="reels-nav-controls">
            <button
              onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
              disabled={currentIndex === 0}
              className="reels-nav-btn"
            >
              ↑ Prev
            </button>
            <button
              onClick={() => currentIndex < reelsData.length - 1 && setCurrentIndex(prev => prev + 1)}
              disabled={currentIndex === reelsData.length - 1}
              className="reels-nav-btn"
            >
              ↓ Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReelsComponent;