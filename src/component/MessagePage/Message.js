import { useNavigate } from "react-router-dom";
import "./Message.css";

function Message() {

    const nevigate=useNavigate();
    return (
        <>
            <div className="message-container">
                <div className="sidebar-column">
                    <div className="sidebar-icons">
                        <button onClick={()=>nevigate("/Main")}><i className="bi bi-house-heart"></i></button>
                        {/* <button><i className="bi bi-search"></i></button> */}
                        {/* <button><i className="bi bi-file-earmark-play"></i></button> */}
                        {/* <button><i className="bi bi-chat"></i></button> */}
                        {/* <button><i className="bi bi-bell"></i></button> */}
                        <button onClick={()=>nevigate("/profile")}><i className="bi bi-person"></i></button>
                        {/* <button><i className="bi bi-plus-circle"></i></button> */}
                    </div>
                </div>

                <div className="chat-list-column">
                    <div className="chat-header">being_lalit_007</div>
                    <input type="text" placeholder="🔍 Search" className="search-bar" />
                    <div className="message-list-label">Message ...</div>
                    <div className="chat-list">
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        <div className="chat-item">
                            <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                            <span>Rohit_Arwal_767</span>
                        </div>
                        
                    </div>
                </div>

                <div className="chat-window-column">
                    <div className="chat-topbar">
                        <div className="chat-avatar"><i className="bi bi-person" style={{ marginLeft: "9px", position: 'relative', top: "6px" }}></i></div>
                        <span className="chat-username">Rohit_Arwal_767</span>
                        <div className="chat-actions">
                            <span><i className="bi bi-telephone"></i></span>
                            <span><i className="bi bi-camera-video"></i></span>
                        </div>
                    </div>
                    <div className="chat-body">
                        <span className="start-chat-text">Start a Conversation 💬</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Message;
