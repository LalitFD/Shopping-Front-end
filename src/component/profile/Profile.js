import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import End_Points from "../../api/End_Points";

function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("Social-User"));

  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(End_Points.SINGLE_POST, {
          withCredentials: true
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLogOut = () => {
    sessionStorage.setItem("Social-User", "");
    sessionStorage.clear();
    navigate("/");
  }

  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/getComments/${postId}`, {
        withCredentials: true
      });
      setCurrentComments(response.data.comments || response.data || []);
      setShowCommentsModal(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to load comments!");
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle comments click
  const handleCommentsClick = (postId, event) => {
    event.stopPropagation();
    fetchComments(postId);
  };

  // Close comments modal
  const closeCommentsModal = () => {
    setShowCommentsModal(false);
    setCurrentComments([]);
  };

  // Like functionality
  const handleLike = async (postId, event) => {
    event.stopPropagation(); // Prevent any parent click handlers
    try {
      const response = await axios.put(`http://localhost:3000/api/like/${postId}`, {}, {
        withCredentials: true
      });

      // Update the posts state to reflect the like change
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const isCurrentlyLiked = post.likes?.some(like => like.user === userData._id);
            return {
              ...post,
              likes: isCurrentlyLiked
                ? post.likes.filter(like => like.user !== userData._id)
                : [...(post.likes || []), { user: userData._id }]
            };
          }
          return post;
        })
      );

    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to like/unlike post!");
    }
  };

  // Check if current user has liked the post
  const isLikedByCurrentUser = (post) => {
    return post.likes?.some(like => like.user === userData._id) || false;
  };

  // Function to get first letter of name for default avatar
  const getInitials = (name) => {
    if (!name) return "U"; // Default to "U" for User if no name
    return name.charAt(0).toUpperCase();
  };

  // Function to generate background color based on name
  const getAvatarColor = (name) => {
    if (!name) return "#6B7280"; // Default gray color

    const colors = [
      "#EF4444", "#F97316", "#F59E0B", "#EAB308",
      "#84CC16", "#22C55E", "#10B981", "#14B8A6",
      "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
      "#8B5CF6", "#A855F7", "#D946EF", "#EC4899"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Profile Avatar Component
  const ProfileAvatar = () => {
    const hasProfileImage = userData?.profile?.imageName;

    if (hasProfileImage) {
      return (
        <img
          onClick={() => navigate("/profileUpdate")}
          src={`${End_Points.PROFILE_IMAGE}/${userData.profile.imageName}`}
          alt="Profile"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            cursor: "pointer",
            objectFit: "cover"
          }}
        />
      );
    }

    // Default avatar with first letter
    return (
      <div
        onClick={() => navigate("/profileUpdate")}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: getAvatarColor(userData?.name),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
          userSelect: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        {getInitials(userData?.name)}
      </div>
    );
  };

  // Comments Modal Component
  const CommentsModal = () => {
    if (!showCommentsModal) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={closeCommentsModal}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '70vh',
            width: '90%',
            overflowY: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h3 style={{ margin: 0, color: '#333' }}>Comments</h3>
            <button
              onClick={closeCommentsModal}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Comments List */}
          {loadingComments ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              Loading comments...
            </div>
          ) : currentComments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentComments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px'
                  }}
                >
                  {/* Comment Author Avatar */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: getAvatarColor(comment.user?.name || comment.username || 'User'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {getInitials(comment.user?.name || comment.username || 'User')}
                  </div>

                  {/* Comment Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      {comment.user?.username || comment.username || 'Unknown User'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#555',
                      lineHeight: '1.4'
                    }}>
                      {comment.text || comment.comment || 'No comment text'}
                    </div>
                    {comment.createdAt && (
                      <div style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '4px'
                      }}>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              No comments yet
            </div>
          )}
        </div>
      </div>
    );
  };

  return <>
    <Sidebar />

    <div className="main-content " style={{ width: "80vw", marginLeft: "10%", marginTop: "-11px", height: "94vh" }}>
      <div className="profile-header" style={{ marginTop: "-16px" }}>
        <div className="profile-title">Profile</div>

        <div className="profile-info">
          <div className="profile-avatar" style={{ position: "relative", top: "20px" }}>
            <ProfileAvatar />
          </div>

          <div className="profile-details" style={{ width: "5%" }}>
            <div className="username-section">
              <h2 className="username">{userData.username}</h2>
              <button className="edit-btn" onClick={() => navigate("/EditProfile")}>
                Edit profile
              </button>
              <button
                className="edit-btn"
                onClick={handleLogOut}
                style={{ backgroundColor: "#443736" }}
              >
                LogOut
              </button>
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{posts.length || 0}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{userData.followers?.length || 0}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{userData.following?.length || 0}</span>
                <span className="stat-label">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="bio">
              <div className="name">{userData.name}</div>
              <div className="description">{userData.bio || "bio Coding  ZZZ..😊"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="Posts-header">
        <div className="AllPost">
          {posts.map((post, index) => (
            <div
              className="post"
              key={post._id || index}
              onMouseEnter={() => setHoveredPost(post._id)}
              onMouseLeave={() => setHoveredPost(null)}
              style={{ position: 'relative', cursor: 'pointer', border: "0.5px solid white" }}
            >
              {post.media && post.media.length > 0 ? (
                post.media[0].type === 'video' ? (
                  <video
                    controls
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  >
                    <source src={post.media[0].url} type="video/mp4" />
                    Your browser does not support video.
                  </video>
                ) : (
                  <img
                    src={post.media[0].url}
                    alt={`Post ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                )
              ) : (
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  color: '#666'
                }}>
                  No Media
                </div>
              )}

              {/* Hover Overlay with Like Button */}
              {hoveredPost === post._id && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      color: 'white',
                      fontSize: '18px'
                    }}
                  >
                    {/* Like Icon and Count */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => handleLike(post._id, e)}
                    >
                      <i
                        className={`bi ${isLikedByCurrentUser(post) ? 'bi-heart-fill' : 'bi-heart'}`}
                        style={{
                          fontSize: '24px',
                          color: isLikedByCurrentUser(post) ? '#ff3040' : 'white'
                        }}
                      ></i>
                      <span style={{ fontWeight: 'bold' }}>
                        {post.likes?.length || 0}
                      </span>
                    </div>

                    {/* Comments Icon - Now Clickable */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={(e) => handleCommentsClick(post._id, e)}
                      onMouseEnter={(e) => {
                        e.target.closest('div').style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.closest('div').style.backgroundColor = 'transparent';
                      }}
                    >
                      <i
                        className="bi bi-chat"
                        style={{ fontSize: '24px' }}
                      ></i>
                      <span style={{ fontWeight: 'bold' }}>
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal />
    </div>
  </>
}

export default Profile;
