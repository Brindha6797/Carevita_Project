import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

const HealthDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await API.get("/health/summary");
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Analyzing your health data...</div>;

    return (
        <div className="health-dashboard" style={{ padding: '40px 5%' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>Health Insights & Trends</h2>
                <p style={{ color: 'var(--text-muted)' }}>AI-driven patterns based on your logs</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Insights Section */}
                <div>
                    <h3 style={{ marginBottom: '20px' }}>AI Pattern Predictor</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {data?.insights.map((insight, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                                    padding: '20px', borderRadius: '20px', borderLeft: '6px solid var(--primary)'
                                }}
                            >
                                <p style={{ margin: 0, fontWeight: '500' }}>{insight}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats Summary */}
                <div>
                    <h3 style={{ marginBottom: '20px' }}>Today's Activity</h3>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '16px', textAlign: 'center' }}>
                                <span style={{ fontSize: '2rem' }}>💧</span>
                                <h4 style={{ margin: '8px 0' }}>{data?.today?.waterIntake || 0}ml</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Water Consumed</p>
                            </div>
                            <div style={{ padding: '20px', background: '#fef2f2', borderRadius: '16px', textAlign: 'center' }}>
                                <span style={{ fontSize: '2rem' }}>😴</span>
                                <h4 style={{ margin: '8px 0' }}>{data?.today?.sleepHours || 0}h</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sleep Duration</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Mood Today: <span style={{ color: 'var(--primary)' }}>{data?.today?.mood || "Not logged"}</span></p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Symptoms: {data?.today?.symptoms || "None reported"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Trend simplified */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>Recent Logs</h3>
                <div style={{ overflowX: 'auto', display: 'flex', gap: '16px', paddingBottom: '20px' }}>
                    {data?.history.slice(0, 7).map((log, i) => (
                        <div key={i} style={{
                            minWidth: '150px', background: 'white', padding: '20px', borderRadius: '20px',
                            border: '1px solid #f1f5f9', textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{log.logDate}</p>
                            <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{
                                log.mood === 'Happy' ? "😊" : log.mood === 'Sad' ? "😔" : "😐"
                            }</div>
                            <p style={{ margin: 0, fontWeight: '600' }}>{log.waterIntake}ml</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.sleepHours}h sleep</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HealthDashboard;
