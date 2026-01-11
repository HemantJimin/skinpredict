import React, { useState, useEffect } from 'react';

const MedicineTracker = () => {
    const [medicines, setMedicines] = useState([]);
    const [newMed, setNewMed] = useState('');
    const [newTime, setNewTime] = useState('');
    const [streak, setStreak] = useState(0);

    // Load data from LocalStorage
    useEffect(() => {
        const savedMeds = JSON.parse(localStorage.getItem('medicines')) || [];
        const savedStreak = parseInt(localStorage.getItem('streak') || '0');
        setMedicines(savedMeds);
        setStreak(savedStreak);

        // Request Notification Permission
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Save data to LocalStorage
    useEffect(() => {
        localStorage.setItem('medicines', JSON.stringify(medicines));
        localStorage.setItem('streak', streak.toString());
    }, [medicines, streak]);

    // Timer logic for notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            medicines.forEach(med => {
                if (med.time === currentTime && !med.notifiedToday) {
                    // Send Notification
                    if (Notification.permission === "granted") {
                        new Notification(`Time to take ${med.name}!`, {
                            body: "Stay consistent with your streak! 🔥",
                            icon: "/vite.svg" 
                        });
                    } else {
                        alert(`Time to take ${med.name}!`);
                    }
                    
                    // Mark as notified to prevent spam
                    updateMedicine(med.id, { notifiedToday: true });
                }
            });
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [medicines]);

    const addMedicine = () => {
        if (!newMed || !newTime) return;
        const med = {
            id: Date.now(),
            name: newMed,
            time: newTime,
            taken: false,
            notifiedToday: false
        };
        setMedicines([...medicines, med]);
        setNewMed('');
        setNewTime('');
    };

    const updateMedicine = (id, updates) => {
        setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const markTaken = (id) => {
        const med = medicines.find(m => m.id === id);
        if (med && !med.taken) {
            updateMedicine(id, { taken: true });
            setStreak(prev => prev + 1);
        }
    };

    const deleteMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id));
    };

    return (
        <div className="glass-card tracker-card">
            <div className="tracker-header">
                <h2>💊 Medicine Track & Streak</h2>
                <div className="streak-counter">
                    <span className="flame">🔥</span>
                    <span className="streak-value">{streak}</span>
                    <span className="streak-label">Streak</span>
                </div>
            </div>

            <div className="tracker-input">
                <input 
                    type="text" 
                    placeholder="Medicine Name (e.g. Vitamin C)" 
                    value={newMed}
                    onChange={(e) => setNewMed(e.target.value)}
                />
                <input 
                    type="time" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)}
                />
                <button className="btn-small" onClick={addMedicine}>Add</button>
            </div>

            <div className="medicine-list">
                {medicines.length === 0 ? (
                    <p className="empty-state">No reminders set. Add one above!</p>
                ) : (
                    medicines.map(med => (
                        <div key={med.id} className={`med-item ${med.taken ? 'taken' : ''}`}>
                            <div className="med-info">
                                <span className="med-time">{med.time}</span>
                                <span className="med-name">{med.name}</span>
                            </div>
                            <div className="med-actions">
                                {!med.taken ? (
                                    <button className="btn-check" onClick={() => markTaken(med.id)}>✅ Take</button>
                                ) : (
                                    <span className="status-taken">Taken</span>
                                )}
                                <button className="btn-delete" onClick={() => deleteMedicine(med.id)}>🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicineTracker;
