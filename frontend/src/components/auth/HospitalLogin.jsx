import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const HospitalLogin = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await API.post("/auth/signin", { username: form.username, password: form.password });
            const userData = res.data;
            const roles = userData.roles || [];
            if (!roles.includes("ROLE_HOSPITAL_ADMIN") && !roles.includes("ROLE_RECEPTIONIST") && !roles.includes("ROLE_HOSPITAL")) {
                setError("This account is not a hospital account. Please use the correct login page.");
                setLoading(false);
                return;
            }
            login(userData);
            navigate("/hospital-dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "14px 16px", borderRadius: "14px",
        border: "1.5px solid #e2e8f0", fontSize: "1rem", outline: "none",
        marginBottom: "16px", boxSizing: "border-box", fontFamily: "inherit",
        transition: "border 0.2s"
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ background: "white", borderRadius: "32px", padding: "48px 40px", width: "100%", maxWidth: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
            >
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏥</div>
                    <h1 style={{ fontSize: "1.9rem", fontWeight: "800", color: "#0369a1", margin: 0 }}>Hospital Login</h1>
                    <p style={{ color: "#64748b", margin: "8px 0 0 0" }}>Sign in to manage your hospital</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ background: "#fef2f2", color: "#dc2626", padding: "14px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "0.9rem", border: "1px solid #fecaca" }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Username</label>
                    <input
                        type="text"
                        placeholder="Enter hospital username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        style={inputStyle}
                        required
                    />
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569", display: "block", marginBottom: "6px" }}>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        style={{ ...inputStyle, marginBottom: "28px" }}
                        required
                    />

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
                        {loading ? "Signing in..." : "Sign In →"}
                    </motion.button>
                </form>

                <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "#64748b" }}>
                    Don't have an account?{" "}
                    <Link to="/signup/hospital" style={{ color: "#0369a1", fontWeight: "700", textDecoration: "none" }}>Register Hospital</Link>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "24px", paddingTop: "20px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                        Login as:{" "}
                        <Link to="/login/user" style={{ color: "var(--primary)", fontWeight: "600" }}>Patient</Link>
                        {" | "}
                        <Link to="/login/doctor" style={{ color: "var(--primary)", fontWeight: "600" }}>Doctor</Link>
                    </span>
                </div>
            </motion.div>
        </div>
    );
};

export default HospitalLogin;
