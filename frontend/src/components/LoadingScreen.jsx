import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="spinner-large"></div>
                <h1 className="welcome-text">Skincare Me Apka Swagat hai 🙏</h1>
                <p className="loading-subtitle">Analyzing your unique profile...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
