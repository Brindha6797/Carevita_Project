import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import prescriptionService from "../services/prescriptionService";
import { Link } from "react-router-dom";

const statusColors = {
    ACTIVE: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    COMPLETED: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    EXPIRED: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    CANCELLED: { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
};

const PrescriptionList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);
        fetchPrescriptions(currentUser);
    }, []);

    const fetchPrescriptions = async (currentUser) => {
        try {
            let response;
            if (currentUser?.roles?.includes("ROLE_DOCTOR")) {
                response = await prescriptionService.getDoctorPrescriptions(currentUser.id);
            } else {
                response = await prescriptionService.getPatientPrescriptions(currentUser.id);
            }
            setPrescriptions(response.data);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesFilter = filter === "ALL" || p.status === filter;
        const matchesSearch =
            (p.medicine || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.patientName || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{ width: "44px", height: "44px", border: "4px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%" }}
            />
        </div>
    );

    const selectStyle = {
        padding: "10px 16px", borderRadius: "12px", border: "1.5px solid #e2e8f0",
        fontSize: "0.95rem", outline: "none", background: "white", cursor: "pointer", fontFamily: "inherit"
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 5%" }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "36px", gap: "16px" }}
            >
                <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "var(--primary)", margin: 0 }}>
                    💊 Prescriptions
                </h1>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Search medicines or names..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ ...selectStyle, minWidth: "220px" }}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                    {user?.roles?.includes("ROLE_DOCTOR") && (
                        <Link to="/prescriptions/new" style={{ textDecoration: "none" }}>
                            <motion.div
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                style={{
                                    padding: "10px 22px", background: "var(--primary)", color: "white",
                                    borderRadius: "14px", fontWeight: "700", fontSize: "0.95rem", cursor: "pointer"
                                }}
                            >
                                + New Prescription
                            </motion.div>
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Empty state */}
            {filteredPrescriptions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                        textAlign: "center", padding: "60px 20px", background: "#f8fafc",
                        borderRadius: "24px", border: "2px dashed #e2e8f0"
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
                    <p style={{ fontSize: "1.1rem", color: "#94a3b8", margin: 0 }}>No prescriptions found.</p>
                </motion.div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                    <AnimatePresence>
                        {filteredPrescriptions.map((p, index) => {
                            const sc = statusColors[p.status] || statusColors.CANCELLED;
                            return (
                                <motion.div
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.04 }}
                                    whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                    style={{
                                        background: "white", padding: "24px", borderRadius: "24px",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
                                        transition: "box-shadow 0.2s", cursor: "pointer"
                                    }}
                                >
                                    {/* Status + Date */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                        <span style={{
                                            padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem",
                                            fontWeight: "700", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                                        }}>
                                            {p.status}
                                        </span>
                                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                            {p.prescriptionDate ? new Date(p.prescriptionDate).toLocaleDateString() : "—"}
                                        </span>
                                    </div>

                                    {/* Medicine name */}
                                    <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b", margin: "0 0 4px 0" }}>
                                        {p.medicine}
                                    </h3>
                                    <p style={{ color: "var(--primary)", fontWeight: "600", margin: "0 0 16px 0", fontSize: "0.95rem" }}>
                                        {p.dosage}
                                    </p>

                                    {/* Details */}
                                    <div style={{ display: "grid", gap: "6px", marginBottom: "20px" }}>
                                        <div style={{ display: "flex", fontSize: "0.88rem", color: "#475569" }}>
                                            <span style={{ width: "90px", fontWeight: "600" }}>Doctor:</span>
                                            <span>{p.doctorName || "Dr. CareVita"}</span>
                                        </div>
                                        <div style={{ display: "flex", fontSize: "0.88rem", color: "#475569" }}>
                                            <span style={{ width: "90px", fontWeight: "600" }}>Frequency:</span>
                                            <span>{p.frequency || "As prescribed"}</span>
                                        </div>
                                        {p.patientName && (
                                            <div style={{ display: "flex", fontSize: "0.88rem", color: "#475569" }}>
                                                <span style={{ width: "90px", fontWeight: "600" }}>Patient:</span>
                                                <span>{p.patientName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to={`/prescriptions/${p.id}`}
                                        style={{
                                            display: "block", textAlign: "center", padding: "10px",
                                            color: "var(--primary)", fontWeight: "700", fontSize: "0.9rem",
                                            textDecoration: "none", borderTop: "1px solid #f1f5f9", paddingTop: "14px",
                                            transition: "color 0.2s"
                                        }}
                                    >
                                        View Details →
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default PrescriptionList;
