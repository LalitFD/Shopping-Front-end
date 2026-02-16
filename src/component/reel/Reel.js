import React, { useState, useRef, useEffect } from 'react';
import { Play, Heart, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/End_Points';
import './Reel.css';

const ReelsComponent = () => {
  const navigate = useNavigate();
  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/reel/reels`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      isPlaying ? currentVideo.play().catch(console.error) : currentVideo.pause();
    }
  }, [currentIndex, isPlaying]);

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
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
        break;
      case 'ArrowDown':
        if (currentIndex < reelsData.length - 1) setCurrentIndex(prev => prev + 1);
        break;
      case ' ':
        e.preventDefault();
        setIsPlaying(prev => !prev);
        break;
    }
  };

  const togglePlayPause = () => setIsPlaying(prev => !prev);
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) currentVideo.muted = !isMuted;
  };
  const toggleLike = () => setIsLiked(prev => !prev);

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
          <button onClick={() => window.location.reload()} className="reels-retry-btn">Retry</button>
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
    <div className="reels-main-container">
      <button className="reels-back-btn" onClick={() => navigate('/Main')}>
        <ArrowLeft size={24} color="white" />
      </button>

      <button className="reels-create-btn" onClick={() => navigate('/create-reel')}>
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
            <Heart size={24} className={isLiked ? 'reels-like-active' : 'reels-like-inactive'} />
          </button>
          <button onClick={toggleMute} className="reels-action-btn">
            {isMuted ? <VolumeX size={24} color="white" /> : <Volume2 size={24} color="white" />}
          </button>
        </div>

        <div className="reels-bottom-info">
          <div className="reels-info-content">
            <span className="reels-creator-name">{currentReel.createdBy.name}</span>
            <p className="reels-description">{currentReel.description.replace(/"/g, '')}</p>
            <div className="reels-date">
              {new Date(currentReel.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsComponent;
