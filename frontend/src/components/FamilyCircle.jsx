import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const FamilyCircle = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "", relation: "", age: "", email: "", emergencyContact: "", medicalNotes: ""
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await API.get("/family/list");
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        try {
            await API.post("/family/add", formData);
            setShowModal(false);
            setFormData({ name: "", relation: "", age: "", email: "", emergencyContact: "", medicalNotes: "" });
            fetchMembers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this member from your circle?")) {
            try {
                await API.delete(`/family/${id}`);
                fetchMembers();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="family-circle-container" style={{ padding: '40px 5%' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '8px' }}>Family Health Circle</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage and monitor your loved ones' health</p>
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="btn-primary"
                style={{ marginBottom: '32px' }}
            >
                + Add Family Member
            </motion.button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                <AnimatePresence>
                    {members.map((member) => (
                        <motion.div
                            key={member.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                background: 'white', padding: '24px', borderRadius: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%', background: '#f0f9ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                }}>
                                    👤
                                </div>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.2rem' }}
                                >
                                    ×
                                </button>
                            </div>
                            <h3 style={{ marginBottom: '4px' }}>{member.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{member.relation} | {member.age} years</p>
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.85rem' }}>
                                <p><strong>Contact:</strong> {member.emergencyContact}</p>
                                {member.medicalNotes && <p><strong>Notes:</strong> {member.medicalNotes}</p>}
                            </div>
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

                        <h3 style={{ marginBottom: '24px' }}>Add Family Member</h3>

                        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="text" placeholder="Relation (e.g., Mother)" value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <input type="text" placeholder="Emergency Contact" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }} />
                        <textarea placeholder="Medical Notes (optional)" value={formData.medicalNotes} onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', height: '80px', fontFamily: 'inherit' }} />

                        <button onClick={handleAdd} className="btn-primary" style={{ width: '100%' }}>Add Member</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default FamilyCircle;
