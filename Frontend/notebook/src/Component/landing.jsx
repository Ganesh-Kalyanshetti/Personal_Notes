import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/landing.css'
import { useEffect } from 'react';
import '../Images/background.jpg'
function Landing() {
    const [showAbout, setShowAbout] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Personal Notes';
    }, []);

    return (
        <div className="landing-container">

            {/* <div className="background-img" /> */}
            <div>
                <img src="backgroung.jpg" alt="" />
            </div>
            <div className="landing-nav">
                <div className="side-naming">
                    <h4><b>Personal Notes</b></h4>
                </div>

                <div className="nav-buttons">
                    <button onClick={() => navigate('/register')}>Register</button>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => setShowAbout(true)}>About</button>
                </div>
            </div>


            <div className="landing-main">
                <h1>Personal Notes</h1>
                <p>A clean and minimal place to organize your text and image-based notes in folders.</p>
            </div>


            {/* About Modal */}
            {showAbout && (
                <div className="about-modal" onClick={() => setShowAbout(false)}>
                    <div className="about-content" onClick={(e) => e.stopPropagation()}>
                        <h4>About Personal Notes</h4>
                        <p> <b>
                            {/* Personal Notes is a simple, secure platform to organize your ideas, documents, and images inside folders.
                            Built with a minimalist design and rich editing tools. */}
                            A Personal Note website where u can store your Notes, documents and images with easy accessable on internet from anywhere
                        </b>
                        </p>
                        <button onClick={() => setShowAbout(false)}>Close</button>
                    </div>
                </div>
            )}

            <footer className="landing-footer">
                <p>Made by Mark</p>
            </footer>
        </div>
    );
}

export default Landing;
