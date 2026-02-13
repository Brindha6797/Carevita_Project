import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await API.get("/appointments/my");
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "BOOKED": return "#3b82f6";
            case "COMPLETED": return "#10b981";
            case "CANCELLED": return "#ef4444";
            default: return "#64748b";
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '40px 5%' }}>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '40px' }}
            >
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)' }}>My Health Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage your upcoming appointments and records</p>
            </motion.div>

            <div className="appointments-section">
                <h3 style={{ marginBottom: '20px' }}>Upcoming Appointments</h3>
                {loading ? (
                    <p>Loading your appointments...</p>
                ) : appointments.length === 0 ? (
                    <div style={{ background: 'var(--glass)', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No appointments found. Start by booking a specialist!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {appointments.map((apt) => (
                            <motion.div
                                key={apt.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'white', padding: '24px', borderRadius: '20px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    border: '1px solid #f1f5f9'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px', height: '60px', borderRadius: '16px', background: '#f8fafc',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'
                                    }}>
                                        👨‍⚕️
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{apt.doctor.name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{apt.doctor.specialization} | {apt.appointmentDate} at {apt.appointmentTime}</p>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '6px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700',
                                        background: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status)
                                    }}>
                                        {apt.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="prescriptions-summary" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Active Prescriptions</h3>
                    <Link to="/prescriptions" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>View All →</Link>
                </div>
                <div style={{
                    background: 'var(--glass)',
                    padding: '30px',
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{
                        fontSize: '2.5rem',
                        background: 'white',
                        width: '70px',
                        height: '70px',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                    }}>
                        💊
                    </div>
                    <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Stay on Track</h4>
                        <p style={{ color: 'var(--text-muted)' }}>You have active prescriptions that need your attention. Check dosages and schedules.</p>
                    </div>
                </div>
            </div>

            <div className="quick-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px' }}>
                <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '24px', borderRadius: '24px', color: 'white' }}>
                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Water Intake</p>
                    <h4 style={{ fontSize: '1.5rem' }}>1.2L <span style={{ fontSize: '1rem', opacity: 0.7 }}>/ 2.5L</span></h4>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Next Reminder</p>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Vitamins at 8:00 PM</h4>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recent Mood</p>
                    <h4 style={{ fontSize: '1.5rem' }}>😊 Calm</h4>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
