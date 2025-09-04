import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import End_Points, { BASE_URL } from "../../api/End_Points";
// import "./Message.css";

const socket = io(BASE_URL);

function Message() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserInfo, setSelectedUserInfo] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ✅ Get current user from session storage
    useEffect(() => {
        try {
            console.log("Getting user from session storage...");
            const storedUser = sessionStorage.getItem("Social-User");

            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log("User found in session storage:", user);
                setCurrentUser(user);
            } else {
                console.log("No user found in session storage");
                setLoading(false);
            }
        } catch (err) {
            console.error("Error parsing user from session storage:", err);
            setLoading(false);
        }
    }, []);

    // ✅ Fetch only VERIFIED users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            if (!currentUser?._id) return;

            try {
                console.log("Fetching users...");
                const res = await axios.get(BASE_URL + "/users", {
                    withCredentials: true
                });
                console.log("Users response:", res.data);

                const userList = Array.isArray(res.data) ? res.data : res.data.users || res.data.data || [];

                // 🔍 DEBUG: Print ALL users and their verification status
                console.log("=== ALL USERS FROM BACKEND ===");
                console.log("Total users:", userList.length);
                console.log("Current user ID:", currentUser._id);

                userList.forEach((user, index) => {
                    console.log(`\n--- User ${index + 1} ---`);
                    console.log("ID:", user._id);
                    console.log("Name:", user.name);
                    console.log("Username:", user.username);
                    console.log("Email:", user.email);
                    console.log("isVerified:", user.isVerified);
                    console.log("isVerified Type:", typeof user.isVerified);
                    console.log("Is Current User:", user._id === currentUser._id);
                });

                // 🔍 Print ONLY VERIFIED users (isVerified === true)
                console.log("\n=== VERIFIED USERS ONLY ===");
                const trueVerifiedUsers = userList.filter(user => user.isVerified === true);
                console.log("True verified users count:", trueVerifiedUsers.length);

                trueVerifiedUsers.forEach((user, index) => {
                    console.log(`✅ Verified User ${index + 1}:`, {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        isVerified: user.isVerified
                    });
                });

                // ✅ Filter: Only verified users + exclude current user
                const verifiedUsers = userList.filter(user => {
                    const isNotCurrentUser = user._id !== currentUser._id;
                    const isVerified = user.isVerified === true;

                    if (isVerified && isNotCurrentUser) {
                        console.log(`🎯 Final filtered user: ${user.username || user.name}`);
                    }

                    return isNotCurrentUser && isVerified;
                });

                console.log("\n=== FINAL RESULT ===");
                console.log("Users to show in chat:", verifiedUsers.length);
                console.log("Final users list:", verifiedUsers);
                setUsers(verifiedUsers);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setLoading(false);
            }
        };

        if (currentUser?._id) {
            fetchUsers();
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || !currentUser._id) return;

        console.log("Registering user:", currentUser._id);
        socket.emit("register", currentUser._id);

        socket.on("online_users", (users) => {
            console.log("Online users:", users);
            setOnlineUsers(users);
        });

        socket.on("receive_private_message", (data) => {
            console.log("Received message:", data);
            if (
                (data.senderId === selectedUser && data.receiverId === currentUser._id) ||
                (data.senderId === currentUser._id && data.receiverId === selectedUser)
            ) {
                setMessages((prev) => {
                    const isDuplicate = prev.some(msg =>
                        msg.text === data.text &&
                        msg.senderId === data.senderId &&
                        Math.abs(new Date(msg.createdAt || Date.now()) - new Date(data.createdAt || Date.now())) < 1000
                    );

                    if (isDuplicate) return prev;
                    return [...prev, { ...data, createdAt: data.createdAt || new Date() }];
                });
            }
        });

        return () => {
            socket.off("online_users");
            socket.off("receive_private_message");
        };
    }, [currentUser, selectedUser]);

    const startChat = async (userId) => {
        if (!currentUser?._id) {
            console.error("Current user not available");
            return;
        }

        setSelectedUser(userId);
        setMessages([]);

        const userInfo = users.find(user => user._id === userId);
        setSelectedUserInfo(userInfo);

        try {
            console.log(`Fetching messages for: ${currentUser._id} <-> ${userId}`);
            const res = await axios.get(
                `${BASE_URL}/Msg/messages/${userId}`,
                { withCredentials: true }
            );
            console.log("Fetched messages:", res.data);

            if (res.data.success && res.data.data) {
                setMessages(res.data.data);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error("Error fetching messages:", err.response?.data || err.message);
            setMessages([]);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser || !currentUser?._id || sending) return;

        setSending(true);

        const msgData = {
            text: message.trim()
        };

        try {
            const response = await axios.post(
                `${BASE_URL}/Msg/messages/${selectedUser}`,
                msgData,
                { withCredentials: true }
            );

            if (response.data.success) {
                const socketData = {
                    senderId: currentUser._id,
                    receiverId: selectedUser,
                    text: message.trim(),
                    createdAt: new Date()
                };
                socket.emit("private_message", socketData);

                const newMessage = {
                    senderId: currentUser._id,
                    receiverId: selectedUser,
                    text: message.trim(),
                    createdAt: new Date()
                };

                setMessages((prev) => [...prev, newMessage]);
                setMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                fontSize: "18px",
                color: "#666"
            }}>
                <div>
                    Loading chat...
                    <div style={{ fontSize: "14px", marginTop: "10px" }}>
                        Finding verified users...
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                fontSize: "18px",
                color: "#666"
            }}>
                <div>Please log in to use chat</div>
                <div style={{ fontSize: "14px", marginTop: "10px", color: "#999" }}>
                    Session storage mein user data nahi mila. Please login again.
                </div>
                <button
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.href = "/login";
                    }}
                    style={{
                        marginTop: "15px",
                        padding: "8px 16px",
                        backgroundColor: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // ✅ Check if current user is verified
    if (currentUser && !currentUser.isVerified) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                fontSize: "18px",
                color: "#666",
                textAlign: "center"
            }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
                <div>Account Not Verified</div>
                <div style={{ fontSize: "14px", marginTop: "10px", color: "#999", maxWidth: "400px" }}>
                    Please verify your email account to access chat features.
                    Only verified users can send and receive messages.
                </div>
                <div style={{ fontSize: "12px", marginTop: "10px", color: "#999" }}>
                    Check your email for verification link
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            height: "100vh",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
            {/* Sidebar */}
            <div style={{
                width: "300px",
                borderRight: "1px solid #ddd",
                // backgroundColor: "#f8f9fa",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{
                    padding: "15px",
                    borderBottom: "1px solid #ddd",
                    // backgroundColor: "#fff"
                }}>
                    <h4 style={{ margin: 0, color: "white" }}>
                        Chats
                        <span style={{
                            fontSize: "12px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            marginLeft: "8px"
                        }}>
                            ✓ Verified Only
                        </span>
                    </h4>
                    <small style={{ color: "white" }}>
                        Welcome, {currentUser.username}
                    </small>
                    <br />
                    {/* <small style={{ color: "white" }}>
                        {users.length} verified user{users.length !== 1 ? 's' : ''} available
                    </small> */}
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {users.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                            <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
                            <p>No verified users found</p>
                            <small style={{ color: "#999" }}>
                                Only verified users can chat
                            </small>
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => startChat(user._id)}
                                style={{
                                    padding: "12px 15px",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: selectedUser === user._id ? "#e3f2fd" : "transparent",
                                    borderLeft: selectedUser === user._id ? "3px solid #2196f3" : "3px solid transparent",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedUser !== user._id) {
                                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedUser !== user._id) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }}
                            >
                                <div>
                                    <div style={{
                                        fontWeight: "500",
                                        color: "#10dc62ff",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px"
                                    }}>
                                        {user.username || user.email || user.name}
                                        {/* Verified Badge */}
                                        <span style={{
                                            fontSize: "12px",
                                            color: "#4CAF50"
                                        }}>

                                        </span>
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#666" }}>
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </div>
                                </div>
                                {onlineUsers.includes(user._id) && (
                                    <span style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        backgroundColor: "#4caf50",
                                        display: "inline-block"
                                    }}></span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {selectedUser && selectedUserInfo && (
                    <div style={{
                        padding: "15px 20px",
                        width: "77vw",
                        borderBottom: "1px solid #ddd",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <div>
                            <h5 style={{ margin: 0, color: "#333", display: "flex", alignItems: "center", gap: "8px" }}>
                                {selectedUserInfo.username || selectedUserInfo.email || selectedUserInfo.name}
                                <span style={{ fontSize: "14px", color: "#4CAF50" }}>✓</span>
                            </h5>
                            <small style={{ color: "#666" }}>
                                {onlineUsers.includes(selectedUser) ? "Online" : "Offline"} • Verified
                            </small>
                        </div>
                        {onlineUsers.includes(selectedUser) && (
                            <span style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                // backgroundColor: "#4caf50"
                            }}></span>
                        )}
                    </div>
                )}

                <div style={{
                    flex: 1,
                    padding: "20px",
                    overflowY: "auto",
                    backgroundColor: "#5f605fff"
                }}>
                    {selectedUser ? (
                        messages.length > 0 ? (
                            <>
                                {messages.map((msg, index) => {
                                    const senderId = msg.senderId?._id || msg.senderId;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                display: "flex",
                                                justifyContent: senderId === currentUser._id ? "flex-end" : "flex-start",
                                                marginBottom: "10px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: "70%",
                                                    padding: "8px 12px",
                                                    borderRadius: "18px",
                                                    backgroundColor: senderId === currentUser._id ? "#2196f3" : "#fff",
                                                    color: senderId === currentUser._id ? "#fff" : "#333",
                                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                                    wordWrap: "break-word"
                                                }}
                                            >
                                                <div>{msg.text}</div>
                                                {msg.createdAt && (
                                                    <div style={{
                                                        fontSize: "11px",
                                                        opacity: "0.7",
                                                        marginTop: "4px"
                                                    }}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div style={{
                                textAlign: "center",
                                color: "#888",
                                marginTop: "50px",
                                fontSize: "16px"
                            }}>
                                <div style={{ fontSize: "48px", marginBottom: "10px" }}>💬</div>
                                <div>No messages yet</div>
                                <div style={{ fontSize: "14px", marginTop: "5px" }}>
                                    Start the conversation!
                                </div>
                            </div>
                        )
                    ) : (
                        <div style={{
                            textAlign: "center",
                            width: "75vw",
                            color: "#888",
                            marginTop: "50px",
                            fontSize: "16px"
                        }}>
                            <div style={{ fontSize: "48px", marginBottom: "10px" }}>💬</div>
                            <div>Select a verified user to start chatting</div>
                            <div style={{ fontSize: "14px", marginTop: "5px", color: "#4CAF50" }}>
                                🔒 Secure chat with verified users only
                            </div>
                        </div>
                    )}
                </div>

                {selectedUser && currentUser?._id && (
                    <div style={{
                        padding: "15px 20px",
                        borderTop: "1px solid #ddd",
                        backgroundColor: "#fff"
                    }}>
                        <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                disabled={sending}
                                style={{
                                    flex: 1,
                                    padding: "10px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "25px",
                                    outline: "none",
                                    fontSize: "14px"
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || sending}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#0a8af4ff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "25px",
                                    cursor: sending || !message.trim() ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    opacity: sending || !message.trim() ? "0.6" : "1"
                                }}
                            >
                                {sending ? "..." : "Send"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Message;