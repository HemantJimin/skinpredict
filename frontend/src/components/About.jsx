import React from 'react';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                 <h2 className="section-title">Why SkinPredict?</h2>
                 <p className="section-subtitle">We combine modern dermatology with ancient Ayurvedic wisdom.</p>
                 
                 <div className="features-grid">
                     <div className="feature-card">
                         <div className="icon">🤖</div>
                         <h3>AI Analysis</h3>
                         <p>Advanced machine learning algorithms to detect your specific skin needs.</p>
                     </div>
                     <div className="feature-card">
                         <div className="icon">🥗</div>
                         <h3>Dietary Impact</h3>
                         <p>Understand how your diet affects your skin health and get personalized food plans.</p>
                     </div>
                     <div className="feature-card">
                         <div className="icon">🌿</div>
                         <h3>Holistic Care</h3>
                         <p>Recommendations that balance clinical efficacy with natural, herbal remedies.</p>
                     </div>
                 </div>
            </div>
        </section>
    );
};

export default About;
