import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import About from './components/About';
import MedicineTracker from './components/MedicineTracker';

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Female',
    diet: 'Vegetarian',
    skinType: 'Normal',
    skinIssue: '',
    trustAi: 'Medium',
    ayurveda: 'Yes',
    currentProducts: 'Chemical',
    hairType: 'Straight',
    hairIssue: 'None',
    dietQuality: 'Average'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.age || !formData.skinIssue) {
        alert("⚠️ Please fill in all required fields (Age and Main Concern).");
        return;
    }

    setLoading(true);
    try {
      const payload = {
          "Age_Group": parseInt(formData.age) > 30 ? "30-40" : "20-30",
          "Gender": formData.gender,
          "Diet_Type": formData.diet === "Vegan" ? "Veg" : (formData.diet === "Vegetarian" ? "Veg" : "Non-Veg"),
          "Skin_Type": formData.skinType,
          "Skin_Issue": formData.skinIssue,
          "Trust_in_AI": formData.trustAi === "High" ? 5 : (formData.trustAi === "Medium" ? 3 : 1),
          "Ayurveda_Awareness": formData.ayurveda === "Yes" ? 5 : (formData.ayurveda === "Maybe" ? 3 : 1),
          "Product_Type_Used": formData.currentProducts,
          "Hair_Type": formData.hairType,
          "Hair_Issue": formData.hairIssue,
          "Diet_Quality": formData.dietQuality
      };

      // Use /api/predict for Vercel, fallback to /predict for local dev
      const apiEndpoint = import.meta.env.MODE === 'production' ? '/api/predict' : '/predict';
      const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errText}`);
      }

      const data = await response.json();
      
      // Artificial delay to show off the loading screen
      setTimeout(() => {
          setResult(data);
          setLoading(false);
          // Smooth scroll to results
          setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }, 2000);

    } catch (error) {
        console.error("Error fetching recommendation:", error);
        alert(`❌ Failed to get recommendation. Error: ${error.message}`);
        setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
        {loading && <LoadingScreen />}
        
        <Header />

        <main id="home" className="main-content">
            <div className="container">
                
                {/* Hero Section */}
                <div style={{textAlign: 'center', marginBottom: '3rem'}} className="fade-in">
                    <h1>SkinCare Me Apka Swagat 🙏</h1>
                    <p className="subtitle">Advanced AI-Powered Dermatological Analysis</p>
                </div>

                <div className="content-grid">
                    
                    {/* Left Column: Form */}
                    <div className="fade-in stagger-1 left-column">
                        <div className="glass-card form-card">
                            <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <span>👤</span> Your Profile
                            </h2>
                            
                            <div className="form-row">
                                <div className="question-block">
                                    <label>Age *</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Years" />
                                </div>
                                <div className="question-block">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option>Female</option>
                                        <option>Male</option>
                                    </select>
                                </div>
                            </div>

                            <div className="question-block">
                                <label>Diet Type</label>
                                <select name="diet" value={formData.diet} onChange={handleChange}>
                                    <option>Vegetarian</option>
                                    <option>Non-Vegetarian</option>
                                    <option>Vegan</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="question-block">
                                    <label>Skin Type</label>
                                    <select name="skinType" value={formData.skinType} onChange={handleChange}>
                                        <option>Normal</option>
                                        <option>Oily</option>
                                        <option>Dry</option>
                                        <option>Combi</option>
                                        <option>Sensitive</option>
                                    </select>
                                </div>
                                <div className="question-block">
                                    <label>Diet Quality</label>
                                    <select name="dietQuality" value={formData.dietQuality} onChange={handleChange}>
                                        <option>High</option>
                                        <option>Average</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="question-block">
                                <label>Main Concern *</label>
                                <select name="skinIssue" value={formData.skinIssue} onChange={handleChange} style={{border: !formData.skinIssue ? '2px solid #e0e7ff' : ''}}>
                                    <option value="">Select a concern...</option>
                                    <option value="Acne">Acne & Breakouts</option>
                                    <option value="Pigmentation">Pigmentation / Dark Spots</option>
                                    <option value="Dryness">Extreme Dryness / Flaking</option>
                                    <option value="Sensitivity">Redness / Sensitivity</option>
                                    <option value="Aging">Fine Lines / Aging</option>
                                    <option value="Dullness">Dullness / Lack of Glow</option>
                                </select>
                            </div>

                            <div className="form-row" style={{marginTop: '1.5rem'}}>
                                 <div className="question-block">
                                    <label>Hair Type</label>
                                    <select name="hairType" value={formData.hairType} onChange={handleChange}>
                                        <option>Straight</option>
                                        <option>Wavy</option>
                                        <option>Curly</option>
                                        <option>Coily</option>
                                    </select>
                                </div>
                                <div className="question-block">
                                    <label>Hair Issue</label>
                                    <input type="text" name="hairIssue" value={formData.hairIssue} onChange={handleChange} placeholder="e.g. Dandruff" />
                                </div>
                            </div>
                            
                            <div className="question-block" style={{marginTop: '1.5rem'}}>
                                <label>Current Product Type</label>
                                <select name="currentProducts" value={formData.currentProducts} onChange={handleChange}>
                                    <option value="Chemical">Mostly Chemical / Drugstore</option>
                                    <option value="Herbal">Herbal / Natural</option>
                                    <option value="Ayurvedic">Strictly Ayurvedic</option>
                                    <option value="Mixed">Mixed / I don't know</option>
                                </select>
                            </div>

                            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Analyzing...' : '🚀 Analyze My Health'}
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Medicine Tracker & Results */}
                    <div className="fade-in stagger-2 right-column">
                        
                        <div style={{marginBottom: '3rem'}}>
                            <MedicineTracker />
                        </div>

                        {result && (
                            <div id="results-section">
                                
                                {/* Composition Chart */}
                                {result.Recommended_Product_Composition && (
                                    <div className="glass-card composition-card" style={{marginBottom: '2rem'}}>
                                        <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.2rem'}}>🧪 Smart Composition</h3>
                                        <div className="progress-bar-container">
                                            {parseInt(result.Recommended_Product_Composition.Ayurvedic) > 0 && <div style={{width: result.Recommended_Product_Composition.Ayurvedic, background: '#F59E0B'}} title="Ayurvedic" />}
                                            {parseInt(result.Recommended_Product_Composition.Herbal) > 0 && <div style={{width: result.Recommended_Product_Composition.Herbal, background: '#10B981'}} title="Herbal" />}
                                            {parseInt(result.Recommended_Product_Composition.Chemical) > 0 && <div style={{width: result.Recommended_Product_Composition.Chemical, background: '#3B82F6'}} title="Chemical" />}
                                        </div>
                                        <div className="composition-legend">
                                            <span className="legend-item"><div className="dot" style={{background:'#F59E0B'}}/> Ayurvedic {result.Recommended_Product_Composition.Ayurvedic}</span>
                                            <span className="legend-item"><div className="dot" style={{background:'#10B981'}}/> Herbal {result.Recommended_Product_Composition.Herbal}</span>
                                            <span className="legend-item"><div className="dot" style={{background:'#3B82F6'}}/> Chemical {result.Recommended_Product_Composition.Chemical}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="result-card">
                                    <div className="diagnosis-header">
                                        <span className="result-label" style={{marginBottom: '0.5rem'}}>Primary Diagnosis</span>
                                        <div className="diagnosis-title">
                                            {result.Diagnosis}
                                        </div>
                                    </div>

                                    <div className="result-item">
                                        <span className="result-label">🥗 Recommended Diet</span>
                                        <div className="result-value">{result.Recommended_Diet}</div>
                                    </div>

                                    <div className="result-item">
                                        <span className="result-label">💊 Treatment Path</span>
                                        <div className="tag">{result.Treatment_Method}</div>
                                    </div>

                                    <div style={{marginTop: '2rem'}}>
                                        <span className="result-label" style={{marginBottom: '1rem', display:'block'}}>🥑 Power Foods</span>
                                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                                            {result.Superfoods_For_You.map(f => <span key={f} className="tag green">{f}</span>)}
                                        </div>
                                    </div>
                                    
                                    <div className="routine-box">
                                        <span className="result-label" style={{marginBottom: '0.5rem', display:'block'}}>📅 Daily Routine</span>
                                         <ul className="routine-list">
                                            {result.Daily_Actions.map(a => <li key={a}>{a}</li>)}
                                         </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <About />
        </main>
        
        <Footer />
    </div>
  );
}

export default App;
