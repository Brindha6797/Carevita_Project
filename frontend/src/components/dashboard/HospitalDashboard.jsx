import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const HospitalDashboard = () => {
    const [hospital, setHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [unapprovedDoctors, setUnapprovedDoctors] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [pendingRx, setPendingRx] = useState([]);
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const isHospitalAdmin = user?.roles?.includes("ROLE_HOSPITAL_ADMIN") || user?.roles?.includes("ROLE_ADMIN");
    const isReceptionist = user?.roles?.includes("ROLE_RECEPTIONIST");

    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [doctorForm, setDoctorForm] = useState({
        name: "", specialization: "", experience: "", consultationFee: "", email: ""
    });

    const [confirmModal, setConfirmModal] = useState(null);
    const [allocateModal, setAllocateModal] = useState(null);
    const [cancelModal, setCancelModal] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            await API.post("/hospitals/me/doctors/add", doctorForm);
            setShowAddDoctor(false);
            setDoctorForm({ name: "", specialization: "", experience: "", consultationFee: "", email: "" });
            fetchData();
        } catch (err) {
            alert("Failed to add doctor");
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const hRes = await API.get("/hospitals/me");
            const hospitalData = hRes.data;
            setHospital(hospitalData);

            const [dRes, rRes, wRes, rxRes] = await Promise.all([
                API.get("/hospitals/me/doctors"),
                API.get("/hospitals/me/receptionists"),
                API.get(`/appointments/hospital/${hospitalData.id}/pending`),
                API.get(`/prescriptions/hospital/${hospitalData.id}/pending`)
            ]);

            const allDoctors = dRes.data;
            setDoctors(allDoctors.filter(d => d.approved));
            setUnapprovedDoctors(allDoctors.filter(d => !d.approved));
            setReceptionists(rRes.data);
            setWaiting(wRes.data);
            setPendingRx(rxRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleApproveDoctor = async (id) => {
        try {
            await API.put(`/hospitals/doctors/${id}/approve`);
            fetchData();
        } catch (err) {
            alert("Failed to approve doctor");
        }
    };

    const handleConfirm = async (aptId, doctorId, date, time) => {
        try {
            await API.put(`/appointments/${aptId}/confirm`, { doctorId, date, time });
            setConfirmModal(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to confirm");
        }
    };


    const handleAllocate = async (aptId, doctorId, date, time) => {
        try {
            await API.put(`/appointments/${aptId}/allocate`, { doctorId, appointmentDate: date, appointmentTime: time });
            setAllocateModal(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to allocate");
        }
    };

    const handleCancel = async (aptId, reason) => {
        try {
            await API.put(`/appointments/${aptId}/cancel`, { cancelReason: reason });
            setCancelModal(null);
            fetchData();
        } catch (err) {
            alert("Failed to cancel");
        }
    };

    const handleSendPrescription = async (rxId) => {
        try {
            await API.put(`/prescriptions/${rxId}/dispatch`);
            fetchData();
        } catch (err) {
            alert("Failed to dispatch prescription");
        }
    };


    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: "3rem" }}>🔄</motion.div>
            <p style={{ marginLeft: "20px", fontWeight: "600", color: "#f8fafc" }}>Loading Hospital Portal...</p>
        </div>
    );

    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    return (
        <div className="hospital-dashboard" style={{ padding: "40px 5%", background: "var(--background)", minHeight: "100vh" }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(to right, #818cf8, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {isHospitalAdmin ? "Hospital Administration" : "Reception Portal"}
                </h1>

                {hospital && (
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                        {hospital.name} — {hospital.receptionName}
                    </p>
                )}
            </motion.div>

            {/* Staff Management - Admin Only */}
            {isHospitalAdmin && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Doctors List */}
                    <div style={{ background: "var(--glass)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "1.35rem" }}>👨‍⚕️ Clinicians</h2>
                            <button onClick={() => setShowAddDoctor(true)} className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>+ Add Doctor</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {doctors.map(d => (
                                <motion.div
                                    key={d.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    style={{ padding: "12px", background: "white", borderRadius: "12px", display: "flex", justifyContent: "space-between", boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'default' }}
                                >
                                    <div><strong>{d.name}</strong><br /><span style={{ fontSize: "0.8rem", color: "#64748b" }}>{d.specialization}</span></div>
                                    <div style={{ color: "#10b981", fontWeight: "700" }}>Verified</div>
                                </motion.div>
                            ))}

                            {doctors.length === 0 && <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No clinicians linked.</p>}
                        </div>
                    </div>

                    {/* Receptionists List */}
                    <div style={{ background: "var(--glass)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "1.35rem" }}>📞 Reception Staff</h2>
                            <button className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>+ Add Receptionist</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {receptionists.map(r => (
                                <motion.div
                                    key={r.id}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    style={{ padding: "12px", background: "white", borderRadius: "12px", boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'default' }}
                                >
                                    <strong>{r.fullName || r.username}</strong><br />
                                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{r.email}</span>
                                </motion.div>
                            ))}

                            {receptionists.length === 0 && <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No reception staff added.</p>}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Patient Flow - Receptionist Only (or Admin for oversight) */}
            {(isReceptionist || isHospitalAdmin) && (
                <>
                    {/* Waiting appointments */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: "var(--glass)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                        <h2 style={{ fontSize: "1.35rem", marginBottom: "16px" }}>⏳ Appointment Queue</h2>
                        {waiting.length === 0 ? <p style={{ color: "var(--text-muted)" }}>Queue is empty.</p> : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {waiting.map((apt) => (
                                    <div key={apt.id} style={{ padding: "14px", background: "#fef3c7", borderRadius: "14px", border: "1px solid #fcd34d" }}>
                                        <strong>{apt.patient?.fullName || apt.patient?.username}</strong><br />
                                        <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>Issue: {apt.problem}</p>
                                        <span style={{ fontSize: "0.8rem" }}>{apt.appointmentDate} @ {apt.appointmentTime}</span>
                                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                                            <button onClick={() => setConfirmModal(apt)} style={{ padding: "6px 12px", background: "#f59e0b", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Handle</button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Prescriptions */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: "var(--glass)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                        <h2 style={{ fontSize: "1.35rem", marginBottom: "16px" }}>📋 Rx Dispatch</h2>
                        {pendingRx.length === 0 ? <p style={{ color: "var(--text-muted)" }}>All dispatch cleared.</p> : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {pendingRx.map((rx) => (
                                    <div key={rx.id} style={{ padding: "14px", background: "#dcfce7", borderRadius: "14px", border: "1px solid #86efac" }}>
                                        <strong>{rx.patientName}</strong><br />
                                        <span style={{ fontSize: "0.8rem" }}>From: {rx.doctorName}</span>
                                        <button onClick={() => handleSendPrescription(rx.id)} style={{ display: "block", marginTop: "10px", padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Send to Patient</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </>
            )}


            {/* Modals */}
            <AnimatePresence>
                {confirmModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setConfirmModal(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: "white", padding: "24px", borderRadius: "20px", width: "90%", maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
                            <h3>Confirm appointment</h3>
                            <p>{confirmModal.patient?.fullName} — {confirmModal.appointmentDate} {confirmModal.appointmentTime}</p>
                            <label>Doctor</label>
                            <select id="confirm-doctor" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }}>
                                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
                            </select>
                            <label>Date</label>
                            <input type="date" id="confirm-date" defaultValue={confirmModal.appointmentDate} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }} />
                            <label>Time</label>
                            <select id="confirm-time" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }}>
                                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                <button className="btn-secondary" onClick={() => setConfirmModal(null)}>Cancel</button>
                                <button className="btn-primary" style={{ border: "none" }} onClick={() => handleConfirm(confirmModal.id, Number(document.getElementById("confirm-doctor").value), document.getElementById("confirm-date").value, document.getElementById("confirm-time").value)}>Confirm</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {allocateModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setAllocateModal(null)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "white", padding: "24px", borderRadius: "20px", width: "90%", maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
                            <h3>Allocate slot (when doctor available)</h3>
                            <label>Doctor</label>
                            <select id="alloc-doctor" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }}>
                                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <label>Date</label>
                            <input type="date" id="alloc-date" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }} />
                            <label>Time</label>
                            <select id="alloc-time" style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }}>
                                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                <button className="btn-secondary" onClick={() => setAllocateModal(null)}>Cancel</button>
                                <button className="btn-primary" style={{ border: "none" }} onClick={() => handleAllocate(allocateModal.id, Number(document.getElementById("alloc-doctor").value), document.getElementById("alloc-date").value, document.getElementById("alloc-time").value)}>Allocate</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {cancelModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setCancelModal(null)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: "white", padding: "24px", borderRadius: "20px", width: "90%", maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
                            <h3>Cancel appointment</h3>
                            <p>{cancelModal.patient?.fullName}</p>
                            <label>Reason for cancellation</label>
                            <textarea id="cancel-reason" rows={3} style={{ width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "10px" }} placeholder="Reason..." />
                            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                                <button className="btn-secondary" onClick={() => setCancelModal(null)}>Back</button>
                                <button style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", cursor: "pointer" }} onClick={() => handleCancel(cancelModal.id, document.getElementById("cancel-reason").value)}>Cancel Appointment</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddDoctor && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: 'blur(4px)' }} onClick={() => setShowAddDoctor(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: "white", padding: "32px", borderRadius: "32px", width: "90%", maxWidth: "480px", boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px', color: '#1e293b' }}>Add New Doctor</h2>
                            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.95rem' }}>Link a specialist to your hospital network</p>

                            <form onSubmit={handleAddDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Doctor Full Name</label>
                                    <input
                                        type="text" required placeholder="Dr. Sarah Johnson"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Specialization</label>
                                        <input
                                            type="text" required placeholder="Cardiology"
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Experience (Yrs)</label>
                                        <input
                                            type="number" required placeholder="10"
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            value={doctorForm.experience} onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Consultation Fee ($)</label>
                                    <input
                                        type="number" required placeholder="100"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Email Associated with Account</label>
                                    <input
                                        type="email" required placeholder="doctor@example.com"
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" onClick={() => setShowAddDoctor(false)} style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '16px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Add Doctor</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};


export default HospitalDashboard;
