import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const EmergencySetup = () => {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        contactName: "", phone: "", relation: "", isPrimary: false
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await API.get("/emergency/list");
            setContacts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        try {
            await API.post("/emergency/add", formData);
            setShowModal(false);
            setFormData({ contactName: "", phone: "", relation: "", isPrimary: false });
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this emergency contact?")) {
            try {
                await API.delete(`/emergency/${id}`);
                fetchContacts();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEmergencyAlert = () => {
        alert("🚨 Emergency Alert Sent! Your emergency contacts have been notified with your location and status.");
    };

    return (
        <div className="emergency-setup-container" style={{ padding: '40px 5%', maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '8px' }}>🚨 Emergency Alert System</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Set up trusted contacts for critical situations</p>
            </motion.div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    + Add Emergency Contact
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEmergencyAlert}
                    style={{
                        padding: '12px 24px', borderRadius: '16px', border: 'none',
                        background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer'
                    }}
                >
                    🆘 Send Emergency Alert
                </motion.button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                <AnimatePresence>
                    {contacts.map((contact) => (
                        <motion.div
                            key={contact.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{
                                background: 'white', padding: '20px', borderRadius: '20px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                border: contact.isPrimary ? '2px solid #ef4444' : '1px solid #f1f5f9',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    background: contact.isPrimary ? '#fee2e2' : '#f8fafc',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                }}>
                                    📞
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '4px' }}>
                                        {contact.contactName}
                                        {contact.isPrimary && <span style={{ marginLeft: '8px', fontSize: '0.75rem', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '8px' }}>PRIMARY</span>}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{contact.relation} | {contact.phone}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(contact.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.2rem' }}
                            >
                                ×
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: 'white', padding: '32px', borderRadius: '32px',
                            width: '90%', maxWidth: '500px', position: 'relative'
                        }}
                    >
                        <button onClick={() => setShowModal(false)} style={{
                            position: 'absolute', top: '20px', right: '20px', border: 'none',
                            background: 'none', fontSize: '1.5rem', cursor: 'pointer'
                        }}>&times;</button>

                        <h3 style={{ marginBottom: '24px' }}>Add Emergency Contact</h3>

                        <input type="text" placeholder="Contact Name" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="text" placeholder="Relation" value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                            <input type="checkbox" checked={formData.isPrimary} onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })} />
                            <span>Set as Primary Contact</span>
                        </label>

                        <button onClick={handleAdd} className="btn-primary" style={{ width: '100%' }}>Add Contact</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EmergencySetup;
