import Sidebar from "../Sidebar/Sidebar";
import "./Reel.css";
import { BsHeartFill, BsChatDots, BsFillBookmarkFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";

function Reel() {
    return (
        <>
            <div className="reels-container">
                <Sidebar />
                <div className="reel-content">
                    <div className="reel-card">
                        <video className="reel-video" controls poster="reel-thumbnail.jpg">
                            <source src="your-video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="reel-details">
                            <div className="user-info">
                                <img src="https://i.pravatar.cc/50" alt="user" />
                                <div>
                                    <span className="username">itsaffyy</span>
                                    <span className="follow">• Follow</span>
                                </div>
                            </div>
                            <p className="caption">Tu jaldi haa krde warna...</p>
                            <p className="music">🎵 Kumar, Lata Mangeshkar • I Love Yo</p>
                        </div>
                    </div>

                    <div className="reel-actions">
                        <div><BsHeartFill /><span>101K</span></div>
                        <div><BsChatDots /><span>275</span></div>
                        <div><BsFillBookmarkFill /></div>
                        <div><BiDotsHorizontalRounded /></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reel;
