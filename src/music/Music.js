import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Music.css';
import first from "./first.mp3"
import second from "./second.mp3"
import third from "./third.mp3"
import fourth from "./fourth.mp3"
import fifth from "./fifth.mp3"
import sixth from "./six.mp3"
// import seventh from "./seventh.mp3"
import eighth from "./eight.mp3"
import ninth from "./nine.mp3"
// import tenth from "./tenth.mp3"

function Music() {
    const [tracks, setTracks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showingDefault, setShowingDefault] = useState(true);

    const navigate = useNavigate();

    const defaultSongs = [
        {
            name: "hum tumse na kuch keh sake",
            artists: [{ name: "Hariharan, Krishnan Nair"}],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZfsFSD4uzMrArgmYcQubR2nNZalwFtTxrXA&s" }]
            },
            preview_url: first
        },
        {
            name: "ankhiyon ke jharokhon se",
            artists: [{ name: "हेमलता" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSi_0La9K-yDDYIMfPKkynBIhh_PSO0uhR_w&s" }]
            },
            preview_url: second
        },
        {
            name: "Ajib Dastan Hai Yeh",
            artists: [{ name: "Lata Mangeshkar" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPbV27EZa0HokwPw2ujWN8uJdnbL1nV8Xriw&s" }]
            },
            preview_url: third
        },
        {
            name: "Dil bekarar tha",
            artists: [{ name: "Anuradha podhwal" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwKA4SAJdVYyZy6Ucm2jYrwS38Rty6QiL-Iw&s" }]
            },
            preview_url: fourth
        },
        {
            name: "Ek Pyaar ka nagma hai",
            artists: [{ name: "Lata mangheshkar" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTzPKlDHmz-O8aH2YgWXCZ8rmNUZ5if3aMpA&s" }]
            },
            preview_url: fifth
        },
        {
            name: "jane kaha gaye woh din",
            artists: [{ name: "Shankar-Jaikishan." }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoCPgt199i7KLuNbSTiLy7ts4UFEoD88yf1Q&s" }]
            },
            preview_url: sixth
        },
        {
            name: "kah do ki tum ho meri varna",
            artists: [{ name: "Anuradha Paudwal and Amit Kumar" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOJQdezTXgzfnyavSyKnz37yIiqWMXgBP7g&s" }]
            },
            preview_url: eighth
        },
        {
            name: "ye galiya ye chaubara",
            artists: [{ name: "Lata Mangheshkar" }],
            album: {
                images: [{ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkwXsqPPg9gEjHz2tgfIEvF62tDIyyRqAZgQ&s" }]
            },
            preview_url: ninth
        },
        // {
        //     name: "Deja Vu",
        //     artists: [{ name: "Olivia Rodrigo" }],
        //     album: {
        //         images: [{ url: "https://i.scdn.co/image/ab67616d0000b273..." }]
        //     },
        //     preview_url: null
        // },
        // {
        //     name: "Montero (Call Me By Your Name)",
        //     artists: [{ name: "Lil Nas X" }],
        //     album: {
        //         images: [{ url: "https://i.scdn.co/image/ab67616d0000b273..." }]
        //     },
        //     preview_url: null
        // }
    ];

    useEffect(() => {
        setTracks(defaultSongs);
    }, []);

    const getTracks = async () => {
        if (!searchQuery.trim()) {
            setTracks(defaultSongs);
            setShowingDefault(true);
            return;
        }

        setIsLoading(true);
        setShowingDefault(false);
        try {
            const response = await fetch(`https://v1.nocodeapi.com/being_lalit/spotify/xHIuUORirotindMR/search?q=${searchQuery}&type=track`);
            const data = await response.json();
            setTracks(data.tracks.items);
        } catch (error) {
            console.error("Error fetching tracks:", error);
            setTracks(defaultSongs);
            setShowingDefault(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getTracks();
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setTracks(defaultSongs);
        setShowingDefault(true);
    };

    return (
        <div className="musicContainer">
            <nav className="musicNavbar">
                <a className="musicNavbarBrand" onClick={() => navigate("/Main")} style={{ cursor: "pointer" }}>
                    Music 🎧
                </a>
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
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                    {!showingDefault && (
                        <button
                            className="musicBtn musicBtnSecondary"
                            onClick={clearSearch}
                            style={{ marginLeft: '10px' }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </nav>

            <div className="musicMainContent">
                {/* <div className="musicHeader">
                    {showingDefault ? (
                        // <h2>🎵 Popular Songs</h2>
                    ) : (
                        <h2>🔍 Search Results for "{searchQuery}"</h2>
                    )}
                </div> */}

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
                                    src={track.album.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
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

                {tracks.length === 0 && !isLoading && !showingDefault && (
                    <div className="noResultsContainer">
                        <p>No songs found for "{searchQuery}". Try a different search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Music;