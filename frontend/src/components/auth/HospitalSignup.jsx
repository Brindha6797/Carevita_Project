import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const HospitalSignup = () => {
    const [form, setForm] = useState({
        username: "", email: "", password: "", confirmPassword: "",
        fullName: "", hospitalName: "", receptionName: "", location: "", address: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            // Step 1: Create the hospital record
            await API.post("/hospitals", {
                name: form.hospitalName,
                receptionName: form.receptionName,
                location: form.location,
                address: form.address
            });

            // Step 2: Register the hospital admin user
            await API.post("/auth/signup", {
                username: form.username,
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                hospital: form.hospitalName,
                role: ["hospital_admin"]
            });

            setSuccess("Hospital registered successfully! You can now log in.");
            setTimeout(() => navigate("/login/hospital"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "12px 14px", borderRadius: "12px",
        border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none",
        marginBottom: "14px", boxSizing: "border-box", fontFamily: "inherit"
    };

    const labelStyle = {
        fontSize: "0.82rem", fontWeight: "600", color: "#475569",
        display: "block", marginBottom: "5px"
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: "white", borderRadius: "32px", padding: "48px 40px", width: "100%", maxWidth: "540px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
            >
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏥</div>
                    <h1 style={{ fontSize: "1.9rem", fontWeight: "800", color: "#0369a1", margin: 0 }}>Register Hospital</h1>
                    <p style={{ color: "#64748b", margin: "8px 0 0 0" }}>Create a hospital account on CareVita</p>
                </div>

                {error && (
                    <div style={{ background: "#fef2f2", color: "#dc2626", padding: "14px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #fecaca" }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ background: "#f0fdf4", color: "#166534", padding: "14px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #bbf7d0" }}>
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Hospital Info Section */}
                    <div style={{ background: "#f0f9ff", padding: "20px", borderRadius: "16px", marginBottom: "20px", border: "1px solid #bae6fd" }}>
                        <h3 style={{ margin: "0 0 16px 0", color: "#0369a1", fontSize: "1rem" }}>🏥 Hospital Information</h3>
                        <label style={labelStyle}>Hospital Name *</label>
                        <input type="text" placeholder="e.g. CareVita General Hospital" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Reception Name *</label>
                        <input type="text" placeholder="Reception desk name" value={form.receptionName} onChange={(e) => setForm({ ...form, receptionName: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Location / City *</label>
                        <input type="text" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Full Address</label>
                        <input type="text" placeholder="Street, Area, City, Pincode" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ ...inputStyle, marginBottom: "0" }} />
                    </div>

                    {/* Admin Account Section */}
                    <div style={{ background: "#fafafa", padding: "20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #e2e8f0" }}>
                        <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1rem" }}>👤 Admin Account</h3>
                        <label style={labelStyle}>Full Name *</label>
                        <input type="text" placeholder="Your full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Username *</label>
                        <input type="text" placeholder="Login username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Email *</label>
                        <input type="email" placeholder="admin@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Password *</label>
                        <input type="password" placeholder="Min 8 chars, uppercase, number" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
                        <label style={labelStyle}>Confirm Password *</label>
                        <input type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} style={{ ...inputStyle, marginBottom: "0" }} required />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", padding: "14px", borderRadius: "16px", border: "none",
                            background: loading ? "#93c5fd" : "linear-gradient(135deg, #0284c7, #0369a1)",
                            color: "white", fontWeight: "700", fontSize: "1rem", cursor: loading ? "wait" : "pointer"
                        }}
                    >
                        {loading ? "Registering..." : "Register Hospital →"}
                    </motion.button>
                </form>

                <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "#64748b" }}>
                    Already registered?{" "}
                    <Link to="/login/hospital" style={{ color: "#0369a1", fontWeight: "700", textDecoration: "none" }}>Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default HospitalSignup;
