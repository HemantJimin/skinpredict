import React, { useEffect, useState } from 'react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
             <div className="header-content">
                <div className="logo">
                     <span className="logo-icon">🌿</span>
                     <span className="logo-text">SkinPredict</span>
                </div>
                <nav>
                    <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
                    <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
                </nav>
             </div>
        </header>
    );
};

export default Header;
