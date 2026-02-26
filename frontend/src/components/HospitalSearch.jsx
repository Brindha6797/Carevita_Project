import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import RequestAppointmentModal from "./RequestAppointmentModal";

const HospitalSearch = () => {
    const [hospitals, setHospitals] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestModal, setRequestModal] = useState(null);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async (searchQuery = "") => {
        setLoading(true);
        try {
            const endpoint = searchQuery ? `/hospitals/search?query=${encodeURIComponent(searchQuery)}` : "/hospitals/all";
            const res = await API.get(endpoint);
            setHospitals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHospitals(query);
    };

    const handleSelectHospital = async (hospital) => {
        setSelectedHospital(hospital);
        try {
            const res = await API.get(`/doctors/all?hospitalId=${hospital.id}`);
            setDoctors(res.data);
        } catch {
            setDoctors([]);
        }
    };

    return (
        <div className="hospital-search" style={{ padding: "40px 5%" }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "40px" }}>
                <h2 style={{ fontSize: "2.2rem", color: "var(--primary)", marginBottom: "16px" }}>Find a Hospital</h2>
                <form onSubmit={handleSearch} style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "12px" }}>
                    <input
                        type="text"
                        placeholder="Search by hospital name or location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ flex: 1, padding: "14px 20px", borderRadius: "16px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
                    />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" type="submit" style={{ border: "none" }}>Search</motion.button>
                </form>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: selectedHospital ? "1fr 1fr" : "1fr", gap: "24px" }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: "var(--glass)", backdropFilter: "blur(10px)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                    <h3 style={{ marginBottom: "16px", color: "var(--primary)" }}>Hospitals</h3>
                    {loading ? <p>Loading...</p> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <AnimatePresence>
                                {hospitals.map((h) => (
                                    <motion.div
                                        key={h.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        whileHover={{ x: 4 }}
                                        onClick={() => handleSelectHospital(h)}
                                        style={{
                                            padding: "18px",
                                            borderRadius: "16px",
                                            border: selectedHospital?.id === h.id ? "2px solid var(--primary)" : "1px solid #e2e8f0",
                                            background: selectedHospital?.id === h.id ? "rgba(79, 70, 229, 0.08)" : "white",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <strong style={{ fontSize: "1.1rem" }}>{h.name}</strong>
                                        <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "6px" }}>{h.receptionName && `Reception: ${h.receptionName}`} | {h.location} | {h.address}</div>
                                        {h.details && <div style={{ fontSize: "0.85rem", marginTop: "6px", color: "#64748b" }}>{h.details}</div>}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {hospitals.length === 0 && !loading && <p style={{ color: "var(--text-muted)" }}>No hospitals found.</p>}
                        </div>
                    )}
                </motion.div>

                {selectedHospital && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: "var(--glass)", backdropFilter: "blur(10px)", padding: "24px", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                        <h3 style={{ marginBottom: "16px", color: "var(--primary)" }}>Doctors at {selectedHospital.name}</h3>
                        {doctors.length === 0 ? (
                            <p style={{ color: "var(--text-muted)" }}>No doctors linked to this hospital yet. You can still request an appointment — reception will assign a doctor.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {doctors.map((d) => (
                                    <div key={d.id} style={{ padding: "16px", background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <strong>{d.name}</strong> — {d.specialization}
                                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>${d.consultationFee} | {d.experience}+ yrs</div>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ border: "none", padding: "10px 18px" }} onClick={() => setRequestModal({ hospital: selectedHospital, doctor: d })}>Request Appointment</motion.button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-secondary" style={{ marginTop: "16px", width: "100%" }} onClick={() => setRequestModal({ hospital: selectedHospital, doctor: null })}>Request appointment (reception will assign doctor)</motion.button>
                    </motion.div>
                )}
            </div>

            {requestModal && (
                <RequestAppointmentModal
                    hospital={requestModal.hospital}
                    doctor={requestModal.doctor}
                    onClose={() => setRequestModal(null)}
                    onSuccess={() => { setRequestModal(null); }}
                />
            )}
        </div>
    );
};

export default HospitalSearch;
