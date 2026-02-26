import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationFeed = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔔 Recent Notifications
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'grid', gap: '12px' }}>
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No new alerts.</p>
                    ) : (
                        notifications.map(n => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    background: n.isRead ? '#f8fafc' : '#f0f9ff',
                                    borderLeft: `4px solid ${n.type === 'EMERGENCY' ? '#ef4444' : '#3b82f6'}`,
                                    position: 'relative'
                                }}
                            >
                                <p style={{ fontSize: '0.85rem', margin: '0 0 4px 0', color: '#1e293b' }}>{n.message}</p>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                    {new Date(n.createdAt).toLocaleString()}
                                </span>
                                {!n.isRead && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '10px' }}
                                    >
                                        Mark read
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotificationFeed;
