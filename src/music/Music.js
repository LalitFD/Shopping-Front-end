// import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Music.css';

// function Music() {
//     const [tracks, setTracks] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');

//     const getTracks = async () => {
//         try {
//             const response = await fetch(`https://v1.nocodeapi.com/being_lalit/spotify/xHIuUORirotindMR/search?q=${searchQuery}&type=track`);
//             const data = await response.json();
//             setTracks(data.tracks.items);
//         } catch (error) {
//             console.error("Error fetching tracks:", error);
//         }
//     };

//     return (
//         <div className="musicContainer">
//             <nav className="musicNavbar">
//                 <a className="musicNavbarBrand" href="#">संगीत</a>
//                 <div className="musicSearchForm">
//                     <input
//                         className="musicSearchInput"
//                         type="search"
//                         placeholder="Search songs"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <button className="musicBtn musicBtnSuccess" onClick={getTracks}>Search</button>
//                 </div>
//             </nav>

//             <div className="musicMainContent">

//                 <div className="musicCardsContainer">
//                     {tracks.map((track, index) => (
//                         <div key={index} className="musicCard col-lg-3 col-md-6">
//                             <img
//                                 src={track.album.images?.[0]?.url}
//                                 className="musicCardImg"
//                                 alt={track.name}
//                             />
//                             <div className="musicCardBody">
//                                 <h5 className="musicCardTitle">{track.name}</h5>
//                                 <p className="musicCardText">Artist: {track.artists[0].name}</p>

//                                 <audio controls className="musicAudioPlayer w-100">
//                                     <source src={track.preview_url} type="audio/mpeg" />
//                                     Your browser does not support the audio element.
//                                 </audio>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Music;



import React, { useState } from 'react';

function Music() {
    const [tracks, setTracks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const nevigate= useNavigate();

    const getTracks = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`https://v1.nocodeapi.com/being_lalit/spotify/xHIuUORirotindMR/search?q=${searchQuery}&type=track`);
            const data = await response.json();
            setTracks(data.tracks.items);
        } catch (error) {
            console.error("Error fetching tracks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getTracks();
        }
    };

    return (
        <div className="musicContainer">
            <nav className="musicNavbar">
                <a className="musicNavbarBrand" onClick={()=>nevigate("/Main")} style={{cursor:"pointer"}}>Music 🎧</a>
                <div className="musicSearchForm">
                    <input
                        className="musicSearchInput"
                        type="search"
                        placeholder="Search songs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className="musicBtn musicBtnSuccess"
                        onClick={getTracks}
                        disabled={isLoading || !searchQuery.trim()}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </nav>

            <div className="musicMainContent">
                {isLoading ? (
                    <div className="loadingContainer">
                        <div className="loadingSpinner"></div>
                        <p className="loadingText">Loading songs...</p>
                    </div>
                ) : (
                    <div className="musicCardsContainer">
                        {tracks.map((track, index) => (
                            <div key={index} className="musicCard col-lg-3 col-md-6">
                                <img
                                    src={track.album.images?.[0]?.url}
                                    className="musicCardImg"
                                    alt={track.name}
                                />
                                <div className="musicCardBody">
                                    <h5 className="musicCardTitle">{track.name}</h5>
                                    <p className="musicCardText">Artist: {track.artists[0].name}</p>

                                    {track.preview_url ? (
                                        <audio controls className="musicAudioPlayer w-100">
                                            <source src={track.preview_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    ) : (
                                        <p className="noPreviewText">Preview not available</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Music;