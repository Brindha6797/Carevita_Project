import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApt, setSelectedApt] = useState(null);
    const [prescription, setPrescription] = useState("");

    useEffect(() => {
        fetchDoctorAppointments();
    }, []);

    const fetchDoctorAppointments = async () => {
        try {
            // Updated endpoint for doctor specific appointments
            const res = await API.get("/appointments/doctor");
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch doctor appointments", err);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await API.put(`/appointments/${id}/status`, { status });
            setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handlePrescribe = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/prescriptions/add`, {
                appointmentId: selectedApt.id,
                patientId: selectedApt.patient.id,
                details: prescription
            });
            alert("Prescription added successfully!");
            setSelectedApt(null);
            setPrescription("");
        } catch (err) {
            alert("Failed to add prescription");
        }
    };

    if (loading) return <div>Loading Doctor Portal...</div>;

    return (
        <div className="doctor-dashboard" style={{ padding: "40px 5%", background: "#f1f5f9", minHeight: "100vh" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: "40px" }}>
                <h1 style={{ color: "#0f172a" }}>Doctor Consultation Portal</h1>
                <p style={{ color: "#64748b" }}>Manage your scheduled appointments and patient care</p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: selectedApt ? "1fr 1fr" : "1fr", gap: "30px" }}>

                {/* Appointments List */}
                <div style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Upcoming Patients</h2>
                    <div style={{ display: "grid", gap: "15px" }}>
                        {appointments.map(apt => (
                            <div key={apt.id} style={{
                                padding: "20px",
                                borderRadius: "20px",
                                border: "1px solid #f1f5f9",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <h4 style={{ margin: "0 0 5px 0" }}>{apt.patient.fullName || apt.patient.username}</h4>
                                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>{apt.appointmentDate} | {apt.appointmentTime}</p>
                                    <span style={{ fontSize: "0.75rem", background: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "99px" }}>{apt.status}</span>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={() => setSelectedApt(apt)}
                                        style={{ background: "#4f46e5", color: "white", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}
                                    >
                                        Consult
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(apt.id, "CANCELLED")}
                                        style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 && <p style={{ textAlign: "center", color: "#64748b" }}>No appointments found.</p>}
                    </div>
                </div>

                {/* Consultation Area (Prescription) */}
                <AnimatePresence>
                    {selectedApt && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ background: "white", padding: "30px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h2 style={{ fontSize: "1.5rem" }}>Prescription Writing</h2>
                                <button onClick={() => setSelectedApt(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
                            </div>
                            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "20px", marginBottom: "20px" }}>
                                <p style={{ margin: 0 }}><strong>Patient:</strong> {selectedApt.patient.fullName}</p>
                                <p style={{ margin: "5px 0 0 0" }}><strong>Date:</strong> {selectedApt.appointmentDate}</p>
                            </div>
                            <form onSubmit={handlePrescribe}>
                                <textarea
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    placeholder="Enter medication details, dosage, and advice..."
                                    style={{ width: "100%", minHeight: "200px", padding: "20px", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "20px", fontFamily: "inherit" }}
                                    required
                                />
                                <button
                                    type="submit"
                                    style={{ width: "100%", background: "#10b981", color: "white", border: "none", padding: "15px", borderRadius: "15px", fontWeight: "600", cursor: "pointer" }}
                                >
                                    Confirm Consultation & Send
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default DoctorDashboard;
