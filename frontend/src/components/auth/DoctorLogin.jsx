import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const DoctorLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card"
            >
                <div className="role-badge" style={{ background: "#f59e0b", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", width: "fit-content", margin: "0 auto 15px", fontWeight: "600" }}>DOCTOR</div>
                <h2>Medical Portal</h2>
                <p>Welcome back, Doctor. Sign in to your portal.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Doctor Username (ID)</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your doctor ID"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: "relative" }}>
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    zIndex: 10,
                                    fontSize: "1.2rem"
                                }}
                            >
                                {showPassword ? "🔓" : "🔒"}
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ paddingLeft: "45px" }}
                                required
                            />
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="auth-button"
                        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
                    >
                        Access Portal
                    </motion.button>
                </form>

                <p className="auth-footer">
                    Not registered yet? <Link to="/signup/doctor">Join our network</Link>
                </p>
                <div style={{ marginTop: "15px", fontSize: "0.8rem" }}>
                    <Link to="/login/user" style={{ color: "var(--text-muted)", marginRight: "10px" }}>User Login</Link>
                    <Link to="/login/admin" style={{ color: "var(--text-muted)" }}>Admin Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorLogin;
