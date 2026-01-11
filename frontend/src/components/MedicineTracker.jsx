import React, { useState, useEffect, useRef } from 'react';

// Simple beep sound (Base64) to ensure it works without external dependencies
const ALARM_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; // Placeholder, I will use a real one in the actual write or just a cleaner URL if base64 is too long. 
// Actually, let's use a publicly reliable URL or a standard beep function.
// Better: Use a reliable short MP3 URL that is definitely accessible.
// Or even better: Use the Web Audio API for a generated beep (no file needed).

const MedicineTracker = () => {
    const [medicines, setMedicines] = useState([]);
    const [newMed, setNewMed] = useState('');
    const [newTime, setNewTime] = useState('');
    const [streak, setStreak] = useState(0);
    
    // Audio ref
    const audioRef = useRef(new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg"));

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
                    // Play Alarm Sound
                    playAlarm();

                    // Send Notification
                    if (Notification.permission === "granted") {
                        new Notification(`Time to take ${med.name}!`, {
                            body: "Stay consistent with your streak! 🔥",
                            icon: "/vite.svg" 
                        });
                    } else {
                        // Fallback if notifications blocked
                        // alert(`Time to take ${med.name}!`); 
                        // Alert blocks execution and might stop audio, better to rely on UI toast or just the sound
                    }
                    
                    // Mark as notified to prevent spam
                    updateMedicine(med.id, { notifiedToday: true });
                }
            });
        }, 1000); // Check every SECOND (more precise) so we don't miss the minute turn

        return () => clearInterval(interval);
    }, [medicines]);

    // Function to play alarm - call this on user interaction too!
    const playAlarm = () => {
        audioRef.current.play().catch(e => {
            console.warn("Audio play blocked by browser policy:", e);
            alert("⏰ Medicine Reminder! (Audio was blocked, click 'Test Sound' to enable for next time)");
        });
    };

    const addMedicine = () => {
        if (!newMed || !newTime) return;
        
        // "Warm up" the audio on user interaction (important for browsers!)
        playAlarm(); 
        setTimeout(() => audioRef.current.pause(), 100); // Stop it immediately, just needed to unlock

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
                <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <button className="btn-small" style={{background:'#6366f1', fontSize:'0.8rem'}} onClick={playAlarm}>
                        🔔 Test Sound
                    </button>
                    <div className="streak-counter">
                        <span className="flame">🔥</span>
                        <span className="streak-value">{streak}</span>
                        <span className="streak-label">Streak</span>
                    </div>
                </div>
            </div>

            <div className="tracker-input">
                <input 
                    type="text" 
                    placeholder="Medicine Name" 
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
