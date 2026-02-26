import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const EmergencySetup = () => {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        contactName: "", phone: "", relation: "", isPrimary: false
    });
    const [nearestHospitals, setNearestHospitals] = useState([]);
    const [alertLocation, setAlertLocation] = useState("");
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [alertSent, setAlertSent] = useState(false);
    const [alertLoading, setAlertLoading] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
        if (!formData.contactName || !formData.phone) return;
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
        try {
            await API.delete(`/emergency/${id}`);
            setConfirmDeleteId(null);
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendAlert = async () => {
        if (!alertLocation.trim()) return;
        setAlertLoading(true);
        try {
            const res = await API.get(`/emergency/nearest?location=${encodeURIComponent(alertLocation)}`);
            setNearestHospitals(res.data);
            setAlertSent(true);
            setShowLocationInput(false);
        } catch (err) {
            console.error(err);
            setAlertSent(true);
            setShowLocationInput(false);
        } finally {
            setAlertLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 5%', maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontSize: '2rem', color: '#ef4444', marginBottom: '8px' }}>🚨 Emergency Alert System</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Set up trusted contacts for critical situations</p>
            </motion.div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    + Add Emergency Contact
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setShowLocationInput(true); setAlertSent(false); setNearestHospitals([]); }}
                    style={{
                        padding: '12px 24px', borderRadius: '16px', border: 'none',
                        background: '#ef4444', color: 'white', fontWeight: '700', cursor: 'pointer'
                    }}
                >
                    🆘 Send Emergency Alert
                </motion.button>
            </div>

            {/* Inline location input */}
            <AnimatePresence>
                {showLocationInput && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}
                    >
                        <h4 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '1.1rem' }}>
                            🚨 Enter your current location to find nearby hospitals
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="e.g. Chennai, Coimbatore, Bangalore..."
                                value={alertLocation}
                                onChange={(e) => setAlertLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendAlert()}
                                autoFocus
                                style={{ flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #fca5a5', fontSize: '1rem', outline: 'none' }}
                            />
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendAlert} disabled={alertLoading}
                                style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', cursor: alertLoading ? 'wait' : 'pointer' }}
                            >
                                {alertLoading ? 'Searching...' : 'Find Help 🚑'}
                            </motion.button>
                            <button onClick={() => setShowLocationInput(false)}
                                style={{ padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Alert sent banner */}
            <AnimatePresence>
                {alertSent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ background: '#fef2f2', border: '2px solid #f87171', borderRadius: '20px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}
                    >
                        <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>
                            🚨 Emergency Alert Sent! Your primary contacts have been notified.
                        </p>
                        {nearestHospitals.length > 0 && (
                            <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
                                Found {nearestHospitals.length} hospital(s) near {alertLocation}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts list */}
            <h3 style={{ marginBottom: '16px', color: '#334155' }}>Your Emergency Contacts</h3>
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
                                border: contact.isPrimary ? '2px solid #ef4444' : '1px solid #f1f5f9'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Contact info */}
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%',
                                        background: contact.isPrimary ? '#fee2e2' : '#f8fafc',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                    }}>
                                        📞
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 4px 0' }}>
                                            {contact.contactName}
                                            {contact.isPrimary && (
                                                <span style={{ marginLeft: '8px', fontSize: '0.75rem', background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '8px' }}>
                                                    PRIMARY
                                                </span>
                                            )}
                                        </h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                                            {contact.relation} | {contact.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Remove button or inline confirmation */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {confirmDeleteId === contact.id ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', padding: '8px 14px', borderRadius: '14px', border: '1px solid #fecaca' }}
                                        >
                                            <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: '600' }}>Remove?</span>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                style={{ padding: '5px 14px', borderRadius: '10px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(null)}
                                                style={{ padding: '5px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.82rem', cursor: 'pointer' }}
                                            >
                                                No
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={() => setConfirmDeleteId(contact.id)}
                                            style={{
                                                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px',
                                                cursor: 'pointer', color: '#ef4444', padding: '8px 16px',
                                                fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}
                                        >
                                            🗑 Remove
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {contacts.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
                        No emergency contacts added yet. Click <strong>+ Add Emergency Contact</strong> to get started.
                    </p>
                )}
            </div>

            {/* Nearest hospitals results */}
            {nearestHospitals.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '40px', background: '#f0f9ff', padding: '32px', borderRadius: '32px', border: '2px dashed #0369a1' }}
                >
                    <h3 style={{ color: '#0369a1', marginBottom: '16px' }}>🏥 Nearby Medical Assistance</h3>
                    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                        {nearestHospitals.map(h => (
                            <div key={h.id} style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ margin: '0 0 4px 0' }}>{h.name}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 8px 0' }}>📍 {h.location}</p>
                                {h.contactNumber && (
                                    <a href={`tel:${h.contactNumber}`} style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        📞 {h.contactNumber}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Add Contact Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        style={{ background: 'white', padding: '32px', borderRadius: '32px', width: '90%', maxWidth: '500px', position: 'relative' }}
                    >
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                            &times;
                        </button>
                        <h3 style={{ marginBottom: '24px' }}>Add Emergency Contact</h3>

                        <input type="text" placeholder="Contact Name *" value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                        <input type="tel" placeholder="Phone Number *" value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                        <input type="text" placeholder="Relation (e.g., Mom, Spouse)" value={formData.relation}
                            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={formData.isPrimary} onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })} />
                            <span>Set as Primary Contact</span>
                        </label>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleAdd} className="btn-primary" style={{ flex: 1 }}>Add Contact</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EmergencySetup;
