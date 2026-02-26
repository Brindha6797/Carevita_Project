import React, { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

const HealthTracker = () => {
    const [water, setWater] = useState(0);
    const [mood, setMood] = useState("");
    const [sleep, setSleep] = useState(8);
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const moodOptions = [
        { emoji: "😊", label: "Happy" },
        { emoji: "😐", label: "Neutral" },
        { emoji: "😔", label: "Sad" },
        { emoji: "😫", label: "Stressed" },
        { emoji: "😴", label: "Tired" }
    ];

    const symptomOptions = ["Headache", "Fever", "Cough", "Body Pain", "Fatigue", "Nausea"];

    const toggleSymptom = (s) => {
        if (symptoms.includes(s)) setSymptoms(symptoms.filter(item => item !== s));
        else setSymptoms([...symptoms, s]);
    };

    const handleLog = async () => {
        setLoading(true);
        try {
            await API.post("/health/log", {
                waterIntake: water,
                mood: mood,
                sleepHours: sleep,
                symptoms: symptoms.join(", ")
            });
            setMessage("Health log updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setMessage("Failed to update log.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="health-tracker-container" style={{ padding: '40px 5%', maxWidth: '800px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-card" style={{ maxWidth: '100%', textAlign: 'left' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Daily Health Log</h2>

                {message && <div style={{
                    background: message.includes("success") ? "#ecfdf5" : "#fef2f2",
                    color: message.includes("success") ? "#059669" : "#dc2626",
                    padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center'
                }}>{message}</div>}

                {/* Water Intake Section */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px' }}>💧 Water Intake: {water}ml</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '12px', background: '#e0f2fe', borderRadius: '99px', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${Math.min((water / 3000) * 100, 100)}%` }}
                                style={{ height: '100%', background: '#3b82f6' }}
                            />
                        </div>
                        <button onClick={() => setWater(Math.max(0, water - 250))} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>-250ml</button>
                        <button onClick={() => setWater(water + 250)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>+250ml</button>

                    </div>
                </div>

                {/* Mood Selection */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px' }}>🎭 Current Mood</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {moodOptions.map(m => (
                            <motion.button
                                key={m.label}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setMood(m.label)}
                                style={{
                                    padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0',
                                    background: mood === m.label ? 'var(--primary)' : 'white',
                                    color: mood === m.label ? 'white' : 'inherit',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem', display: 'block' }}>{m.emoji}</span>
                                <span style={{ fontSize: '0.8rem' }}>{m.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Sleep Section */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px' }}>😴 Sleep Duration: {sleep} hours</label>
                    <input
                        type="range" min="0" max="15" step="0.5"
                        value={sleep} onChange={(e) => setSleep(parseFloat(e.target.value))}
                        style={{ width: '100%', cursor: 'pointer' }}
                    />
                </div>

                {/* Symptoms Section */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '16px' }}>🤒 Any Symptoms Today?</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {symptomOptions.map(s => (
                            <button
                                key={s}
                                onClick={() => toggleSymptom(s)}
                                style={{
                                    padding: '8px 16px', borderRadius: '99px', border: '1px solid #e2e8f0',
                                    background: symptoms.includes(s) ? '#fee2e2' : 'white',
                                    color: symptoms.includes(s) ? '#dc2626' : 'inherit',
                                    fontWeight: symptoms.includes(s) ? '600' : '400',
                                    cursor: 'pointer'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    onClick={handleLog}
                    className="auth-button"
                >
                    {loading ? "Updating..." : "Save Daily Log"}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default HealthTracker;
