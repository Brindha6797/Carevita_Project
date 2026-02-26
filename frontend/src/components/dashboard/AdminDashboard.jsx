import React, { useState, useEffect } from "react";
import AdminService from "../../services/adminService";
import API from "../../services/api";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // We use API directly for hospitals as AdminService might not have it yet
            const [usersRes, doctorsRes, hospitalsRes] = await Promise.all([
                AdminService.getAllUsers(),
                AdminService.getAllDoctors(),
                API.get("/hospitals")
            ]);
            setUsers(usersRes.data);
            setDoctors(doctorsRes.data);
            setHospitals(hospitalsRes.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch data. Are you logged in as Admin?");
            setLoading(false);
        }
    };


    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await AdminService.deleteUser(id);
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                alert("Failed to delete user");
            }
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                await AdminService.deleteDoctor(id);
                setDoctors(doctors.filter(d => d.id !== id));
            } catch (err) {
                alert("Failed to delete doctor");
            }
        }
    };

    if (loading) return <div className="loading">Loading Admin Console...</div>;

    return (
        <div className="admin-dashboard" style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="dashboard-header"
                style={{ marginBottom: "40px", textAlign: "center" }}
            >
                <h1 style={{ fontSize: "2.5rem", color: "var(--primary)" }}>Admin Control Center</h1>
                <p style={{ color: "var(--text-muted)" }}>Manage platform entities and system health</p>
            </motion.div>

            {error && <div className="error-message">{error}</div>}

            <div className="tabs" style={{ display: "flex", gap: "20px", marginBottom: "30px", justifyContent: "center" }}>
                <button
                    onClick={() => setActiveTab("users")}
                    className={activeTab === "users" ? "tab-btn active" : "tab-btn"}
                    style={{
                        padding: "10px 30px",
                        borderRadius: "30px",
                        border: "none",
                        cursor: "pointer",
                        background: activeTab === "users" ? "var(--primary)" : "white",
                        color: activeTab === "users" ? "white" : "var(--text-main)",
                        fontWeight: "600",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}
                >
                    Users ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab("doctors")}
                    className={activeTab === "doctors" ? "tab-btn active" : "tab-btn"}
                    style={{
                        padding: "10px 30px",
                        borderRadius: "30px",
                        border: "none",
                        cursor: "pointer",
                        background: activeTab === "doctors" ? "var(--primary)" : "white",
                        color: activeTab === "doctors" ? "white" : "var(--text-main)",
                        fontWeight: "600",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}
                >
                    Doctors ({doctors.length})
                </button>
                <button
                    onClick={() => setActiveTab("hospitals")}
                    className={activeTab === "hospitals" ? "tab-btn active" : "tab-btn"}
                    style={{
                        padding: "10px 30px",
                        borderRadius: "30px",
                        border: "none",
                        cursor: "pointer",
                        background: activeTab === "hospitals" ? "var(--primary)" : "white",
                        color: activeTab === "hospitals" ? "white" : "var(--text-main)",
                        fontWeight: "600",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}
                >
                    Hospitals ({hospitals.length})
                </button>
            </div>


            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="table-container"
                style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "1px solid rgba(255,255,255,0.3)"
                }}
            >
                {activeTab === "users" ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                <th style={{ padding: "15px" }}>ID</th>
                                <th style={{ padding: "15px" }}>Name</th>
                                <th style={{ padding: "15px" }}>Email</th>
                                <th style={{ padding: "15px" }}>Phone</th>
                                <th style={{ padding: "15px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <motion.tr
                                    key={user.id}
                                    whileHover={{ background: "rgba(79, 70, 229, 0.03)" }}
                                    style={{ borderBottom: "1px solid #f1f5f9", cursor: 'default' }}
                                >
                                    <td style={{ padding: "15px" }}>{user.id}</td>
                                    <td style={{ padding: "15px", fontWeight: "600" }}>{user.fullName || user.username}</td>
                                    <td style={{ padding: "15px" }}>{user.email}</td>
                                    <td style={{ padding: "15px" }}>{user.phoneNumber || "N/A"}</td>
                                    <td style={{ padding: "15px" }}>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}

                        </tbody>
                    </table>
                ) : activeTab === "doctors" ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                <th style={{ padding: "15px" }}>ID</th>
                                <th style={{ padding: "15px" }}>Doctor Name</th>
                                <th style={{ padding: "15px" }}>Specialization</th>
                                <th style={{ padding: "15px" }}>Hospital</th>
                                <th style={{ padding: "15px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doctor => (
                                <motion.tr
                                    key={doctor.id}
                                    whileHover={{ background: "rgba(79, 70, 229, 0.03)" }}
                                    style={{ borderBottom: "1px solid #f1f5f9", cursor: 'default' }}
                                >
                                    <td style={{ padding: "15px" }}>{doctor.id}</td>
                                    <td style={{ padding: "15px", fontWeight: "600" }}>{doctor.name}</td>
                                    <td style={{ padding: "15px" }}>{doctor.specialization}</td>
                                    <td style={{ padding: "15px" }}>{doctor.hospitalName}</td>
                                    <td style={{ padding: "15px" }}>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor.id)}
                                            style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}

                        </tbody>
                    </table>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", textAlign: "left" }}>
                                <th style={{ padding: "15px" }}>ID</th>
                                <th style={{ padding: "15px" }}>Hospital Name</th>
                                <th style={{ padding: "15px" }}>Location</th>
                                <th style={{ padding: "15px" }}>Contact</th>
                                <th style={{ padding: "15px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map(h => (
                                <motion.tr
                                    key={h.id}
                                    whileHover={{ background: "rgba(79, 70, 229, 0.03)" }}
                                    style={{ borderBottom: "1px solid #f1f5f9", cursor: 'default' }}
                                >
                                    <td style={{ padding: "15px" }}>{h.id}</td>
                                    <td style={{ padding: "15px", fontWeight: "600" }}>{h.name}</td>
                                    <td style={{ padding: "15px" }}>{h.location}</td>
                                    <td style={{ padding: "15px" }}>{h.contactNumber}</td>
                                    <td style={{ padding: "15px" }}>
                                        <button
                                            style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}

                        </tbody>
                    </table>
                )}

            </motion.div>
        </div>
    );
};

export default AdminDashboard;
