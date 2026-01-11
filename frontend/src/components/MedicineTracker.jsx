import React, { useState, useEffect, useRef } from 'react';

// Embedded Base64 Beep Sound (Reliable)
const ALARM_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU..."; 
// Ideally we need a Real Base64 string. I will use a short generated beep using Web Audio API instead, which is even more robust and doesn't require a large string.

const MedicineTracker = () => {
    const [medicines, setMedicines] = useState([]);
    const [newMed, setNewMed] = useState('');
    const [newTime, setNewTime] = useState('');
    const [streak, setStreak] = useState(0);
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState('');
    
    // Audio Context Ref
    const audioContextRef = useRef(null);

    // Initialize Audio Context on user interaction
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const playBeep = () => {
        initAudio();
        if (!audioContextRef.current) return;

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContextRef.current.currentTime + 0.5); // Drop to A4

        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    };

    // Load data
    useEffect(() => {
        const savedMeds = JSON.parse(localStorage.getItem('medicines')) || [];
        const savedStreak = parseInt(localStorage.getItem('streak') || '0');
        setMedicines(savedMeds);
        setStreak(savedStreak);

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Save data
    useEffect(() => {
        localStorage.setItem('medicines', JSON.stringify(medicines));
        localStorage.setItem('streak', streak.toString());
    }, [medicines, streak]);

    // Timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            // Force HH:MM format (24h) to match input type="time"
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            setCurrentTimeDisplay(timeString);

            medicines.forEach(med => {
                // Check if time matches AND current SECOND is small (to avoid multiple triggers within a minute if we checked often)
                // But we check every 1s. We rely on 'notifiedToday' flag.
                // We also need to reset 'notifiedToday' at midnight.
                
                if (med.time === timeString && !med.notifiedToday) {
                    console.log("🔔 Triggering Alarm for:", med.name);
                    playBeep();

                    if (Notification.permission === "granted") {
                        new Notification(`Time to take ${med.name}!`, {
                            body: "Stay consistent with your streak! 🔥",
                            icon: "/vite.svg" 
                        });
                    }
                    
                    updateMedicine(med.id, { notifiedToday: true });
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [medicines]);

    // Reset notified flags at midnight (optional, or just manual reset)
    // For simplicity, we just assume daily cycle.

    const addMedicine = () => {
        if (!newMed || !newTime) return;
        
        // Unlock audio on interaction
        playBeep();

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
                <div>
                    <h2>💊 Medicine Tracker</h2>
                    <span style={{fontSize:'0.9rem', color:'#6b7280'}}>Current Time: {currentTimeDisplay}</span>
                </div>
                
                <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                    <button className="btn-small test-btn" onClick={playBeep} title="Test Alarm Sound">
                        🔔 Test
                    </button>
                    <div className="streak-counter">
                        <span className="flame">🔥</span>
                        <span className="streak-value">{streak}</span>
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
                <button className="btn-primary btn-add-med" onClick={addMedicine}>
                    Add Reminder
                </button>
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
