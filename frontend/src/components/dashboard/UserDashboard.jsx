import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NotificationFeed from "../NotificationFeed";


const UserDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [reminder, setReminder] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [healthRes, reminderRes, familyRes] = await Promise.all([
                API.get("/health/summary"),
                API.get("/reminders/buddy"),
                API.get("/family/list")
            ]);
            setSummary(healthRes.data);
            setReminder(reminderRes.data);
            setFamilyMembers(familyRes.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load dashboard data. Please try again.");
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--background)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: "3rem" }}>🌀</motion.div>
            <p style={{ marginLeft: "20px", fontWeight: "600" }}>Loading your health status...</p>
        </div>
    );

    return (
        <div className="user-dashboard" style={{ padding: "40px 5%", background: "var(--background)", minHeight: "100vh", position: 'relative' }}>
            {error && (
                <div style={{
                    padding: '20px', background: '#fee2e2', color: '#dc2626',
                    borderRadius: '20px', marginBottom: '30px', textAlign: 'center', border: '1px solid #fecaca'
                }}>
                    {error}
                </div>
            )}


            {/* Floating SOS Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000
                }}
            >
                <Link to="/emergency" style={{ textDecoration: 'none' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: '#ef4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)', color: 'white'
                    }}>
                        🆘
                    </div>
                </Link>
            </motion.div>


            {/* Header with Care Reminder Buddy */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: "40px" }}
            >
                <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "10px" }}>Welcome Back!</h1>
                {reminder && (
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        style={{
                            background: reminder.needsLog ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                            padding: "20px",
                            borderRadius: "20px",
                            border: `1px solid ${reminder.needsLog ? "#fcc" : "#cfc"}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >
                        <span style={{ fontSize: "1.5rem" }}>{reminder.needsLog ? "🔔" : "✅"}</span>
                        <div>
                            <p style={{ fontWeight: "600", color: reminder.needsLog ? "#991b1b" : "#166534", margin: 0 }}>{reminder.message}</p>
                            {reminder.needsLog && <Link to="/track" style={{ fontSize: "0.9rem", color: "#4f46e5", fontWeight: "bold" }}>Log Now →</Link>}
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px", marginBottom: '30px' }}>
                <div style={{ display: 'grid', gap: '30px' }}>
                    {/* Health Pattern Predictor Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card pattern-predictor"
                        style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                    >
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>🧠</span> Health Pattern Predictor
                        </h2>
                        <div style={{ display: "grid", gap: "15px" }}>
                            {summary?.insights?.map((insight, idx) => (
                                <div key={idx} style={{
                                    padding: "15px",
                                    borderRadius: "15px",
                                    background: insight.startsWith("ALERT") ? "#fef2f2" : insight.startsWith("PATTERN") ? "#fff7ed" : "#f8fafc",
                                    borderLeft: `5px solid ${insight.startsWith("ALERT") ? "#ef4444" : insight.startsWith("PATTERN") ? "#f97316" : "#4f46e5"}`
                                }}>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#1e293b" }}>{insight}</p>
                                </div>
                            ))}
                            {(!summary?.insights || summary.insights.length === 0) && (
                                <p style={{ color: "var(--text-muted)" }}>Not enough data for patterns. Keep logging symptoms!</p>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div style={{ display: 'grid', gap: '30px' }}>
                    <NotificationFeed />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>


                {/* Mood + Health Sync */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card mood-sync"
                    style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                >
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>📊 Mood-Health Overview</h2>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ background: "#f0f9ff", padding: "20px", borderRadius: "20px", flex: 1, textAlign: "center" }}>
                            <p style={{ fontSize: "0.8rem", color: "#0369a1", marginBottom: "5px" }}>Latest Mood</p>
                            <h3 style={{ margin: 0 }}>{summary?.today?.mood || "Neutral"}</h3>
                        </div>
                        <div style={{ background: "#fdf2f8", padding: "20px", borderRadius: "20px", flex: 1, textAlign: "center" }}>
                            <p style={{ fontSize: "0.8rem", color: "#be185d", marginBottom: "5px" }}>Sleep (Avg)</p>
                            <h3 style={{ margin: 0 }}>{summary?.today?.sleepHours || "0"} hrs</h3>
                        </div>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        Based on your logs, we've noticed that your mood tends to {summary?.today?.mood === 'Stressed' ? 'decline when you sleep less than 6 hours' : 'stay positive when you log consistently'}.
                    </p>
                </motion.div>

                {/* Family Health Circle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card family-circle"
                    style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.5rem" }}>👨‍👩‍👧‍👦 Family Circle</h2>
                        <Link to="/family" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>Manage →</Link>
                    </div>
                    {familyMembers.length === 0 ? (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>No family members added yet.</p>
                    ) : (
                        <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
                            {familyMembers.map(member => (
                                <div key={member.id} style={{
                                    minWidth: "150px",
                                    background: "#f8fafc",
                                    padding: "20px",
                                    borderRadius: "20px",
                                    textAlign: "center"
                                }}>
                                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>👤</div>
                                    <h4 style={{ margin: "0 0 5px 0" }}>{member.name}</h4>
                                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{member.relation}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card quick-actions"
                    style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                >
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>⚡ Quick Services</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <Link to="/doctors" className="service-link" style={{ textDecoration: "none" }}>
                            <div style={{ background: "#e0e7ff", padding: "20px", borderRadius: "20px", color: "#3730a3", textAlign: "center", fontWeight: "600" }}>
                                🩺 Find Doctor
                            </div>
                        </Link>
                        <Link to="/prescriptions" className="service-link" style={{ textDecoration: "none" }}>
                            <div style={{ background: "#dcfce7", padding: "20px", borderRadius: "20px", color: "#166534", textAlign: "center", fontWeight: "600" }}>
                                💊 Prescriptions
                            </div>
                        </Link>
                        <Link to="/track" className="service-link" style={{ textDecoration: "none" }}>
                            <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "20px", color: "#92400e", textAlign: "center", fontWeight: "600" }}>
                                📝 Log Symptoms
                            </div>
                        </Link>
                        <Link to="/emergency" className="service-link" style={{ textDecoration: "none" }}>
                            <div style={{ background: "#fee2e2", padding: "20px", borderRadius: "20px", color: "#991b1b", textAlign: "center", fontWeight: "600" }}>
                                🚨 Emergency
                            </div>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default UserDashboard;
