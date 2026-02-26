import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get("/notifications/my");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n)));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await API.put("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: "40px", height: "40px", border: "3px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%" }} />
        </div>
    );

    return (
        <div style={{ padding: "40px 5%", maxWidth: "700px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "2rem", color: "var(--primary)" }}>Notifications</h1>
                {notifications.some((n) => !n.readStatus) && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary" onClick={markAllRead}>Mark all read</motion.button>
                )}
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No notifications yet.</motion.p>
                    ) : (
                        notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    padding: "18px",
                                    borderRadius: "16px",
                                    background: n.readStatus ? "#f8fafc" : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                    border: `1px solid ${n.readStatus ? "#e2e8f0" : "rgba(14, 165, 233, 0.3)"}`,
                                    cursor: n.readStatus ? "default" : "pointer",
                                    transition: "all 0.2s"
                                }}
                                onClick={() => !n.readStatus && markAsRead(n.id)}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-main)" }}>{n.message}</p>
                                    {!n.readStatus && <span style={{ fontSize: "0.7rem", background: "var(--primary)", color: "white", padding: "2px 8px", borderRadius: "999px" }}>New</span>}
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                                    {n.type} • {n.createdAt && new Date(n.createdAt).toLocaleString()}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
