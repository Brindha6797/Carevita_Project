import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const FamilyCircle = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMember, setEditMember] = useState(null); // null = add mode, object = edit mode
    const [formData, setFormData] = useState({
        name: "", relation: "", age: "", email: "", emergencyContact: "", medicalNotes: ""
    });
    const [healthData, setHealthData] = useState({});
    const [fetchingHealth, setFetchingHealth] = useState({});

    const fetchMemberHealth = React.useCallback(async (memberId) => {
        setFetchingHealth(prev => ({ ...prev, [memberId]: true }));
        try {
            const res = await API.get(`/family/${memberId}/health`);
            if (typeof res.data === 'object' && res.data !== null) {
                setHealthData(prev => ({ ...prev, [memberId]: res.data }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFetchingHealth(prev => ({ ...prev, [memberId]: false }));
        }
    }, []);

    const fetchMembers = React.useCallback(async () => {
        try {
            const res = await API.get("/family/list");
            setMembers(res.data);
            res.data.forEach(member => {
                if (member.email) {
                    fetchMemberHealth(member.id);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }, [fetchMemberHealth]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const openAddModal = () => {
        setEditMember(null);
        setFormData({ name: "", relation: "", age: "", email: "", emergencyContact: "", medicalNotes: "" });
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setEditMember(member);
        setFormData({
            name: member.name || "",
            relation: member.relation || "",
            age: member.age || "",
            email: member.email || "",
            emergencyContact: member.emergencyContact || "",
            medicalNotes: member.medicalNotes || ""
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editMember) {
                await API.put(`/family/${editMember.id}`, formData);
            } else {
                await API.post("/family/add", formData);
            }
            setShowModal(false);
            setFormData({ name: "", relation: "", age: "", email: "", emergencyContact: "", medicalNotes: "" });
            setEditMember(null);
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

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '12px',
        border: '1.5px solid #e2e8f0', marginBottom: '14px',
        fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
        transition: 'border 0.2s', fontFamily: 'inherit'
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
                onClick={openAddModal}
                className="btn-primary"
                style={{ marginBottom: '32px' }}
            >
                + Add Family Member
            </motion.button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px' }}>
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
                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
                            }}
                        >
                            {/* Card header: avatar + action buttons */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #e0e7ff, #f0f9ff)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                }}>
                                    👤
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {/* Edit button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => openEditModal(member)}
                                        title="Edit member"
                                        style={{
                                            background: '#f0f9ff', border: '1px solid #bae6fd',
                                            borderRadius: '10px', cursor: 'pointer',
                                            color: '#0369a1', fontSize: '1rem', padding: '6px 10px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ✏️
                                    </motion.button>
                                    {/* Delete button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(member.id)}
                                        title="Remove member"
                                        style={{
                                            background: '#fef2f2', border: '1px solid #fecaca',
                                            borderRadius: '10px', cursor: 'pointer',
                                            color: '#ef4444', fontSize: '1.1rem', padding: '6px 10px'
                                        }}
                                    >
                                        ×
                                    </motion.button>
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '4px', color: '#1e293b' }}>{member.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                                {member.relation} {member.age ? `| ${member.age} years` : ''}
                            </p>

                            {/* Health Sync Section */}
                            {fetchingHealth[member.id] ? (
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>Syncing health data...</div>
                            ) : healthData[member.id] ? (
                                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.82rem', border: '1px solid #bbf7d0' }}>
                                    <div style={{ color: '#15803d', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span>📈</span> Health Sync
                                    </div>
                                    <p style={{ margin: '2px 0' }}><strong>Today's Mood:</strong> {healthData[member.id].today?.mood || 'Not logged'}</p>
                                    {healthData[member.id].insights && healthData[member.id].insights.length > 0 && (
                                        <p style={{ margin: '4px 0', color: '#059669', fontStyle: 'italic' }}>
                                            "{healthData[member.id].insights[0].substring(0, 60)}..."
                                        </p>
                                    )}
                                </div>
                            ) : member.email ? (
                                <div style={{
                                    fontSize: '0.78rem', color: '#64748b', marginBottom: '16px',
                                    background: '#f8fafc', padding: '10px 12px', borderRadius: '10px',
                                    border: '1px dashed #cbd5e1'
                                }}>
                                    📊 Health data not yet available for this member
                                </div>
                            ) : null}

                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
                                {member.emergencyContact && <p style={{ margin: '2px 0' }}><strong>Contact:</strong> {member.emergencyContact}</p>}
                                {member.medicalNotes && <p style={{ margin: '4px 0' }}><strong>Notes:</strong> {member.medicalNotes}</p>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add / Edit Modal */}
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
                            width: '90%', maxWidth: '500px', position: 'relative',
                            maxHeight: '90vh', overflowY: 'auto'
                        }}
                    >
                        <button onClick={() => setShowModal(false)} style={{
                            position: 'absolute', top: '20px', right: '20px', border: 'none',
                            background: 'none', fontSize: '1.5rem', cursor: 'pointer'
                        }}>&times;</button>

                        <h3 style={{ marginBottom: '24px', color: 'var(--primary)' }}>
                            {editMember ? '✏️ Edit Family Member' : '+ Add Family Member'}
                        </h3>

                        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                        <input type="text" placeholder="Relation (e.g., Mother)" value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} style={inputStyle} />
                        <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} style={inputStyle} />
                        <input type="email" placeholder="Email (optional — for health sync)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                        <input type="text" placeholder="Emergency Contact Number" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} style={inputStyle} />
                        <textarea
                            placeholder="Medical Notes (optional)"
                            value={formData.medicalNotes}
                            onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                        />

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                className="btn-primary"
                                style={{ flex: 1, border: 'none' }}
                            >
                                {editMember ? 'Save Changes' : 'Add Member'}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default FamilyCircle;
