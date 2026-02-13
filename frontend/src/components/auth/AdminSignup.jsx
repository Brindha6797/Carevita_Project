import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phoneNumber: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await signup({
                ...formData,
                role: ["admin"]
            });
            alert("Admin registered successfully!");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card"
                style={{ maxWidth: "500px" }}
            >
                <h2>Admin Sign Up</h2>
                <p>Register as a CareVita System Administrator</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-row" style={{ display: "flex", gap: "15px" }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Admin Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Admin ID"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@carevita.com"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1 234 567 890"
                            required
                        />
                    </div>

                    <div className="input-group password-group" style={{ position: "relative" }}>
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
                                    fontSize: "1.2rem",
                                    color: "var(--primary)"
                                }}
                            >
                                {showPassword ? "🔓" : "🔒"}
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                style={{ paddingLeft: "45px" }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="auth-button"
                        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
                    >
                        Register Admin
                    </motion.button>
                </form>

                <p className="auth-footer">
                    Already an admin? <Link to="/login">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default AdminSignup;
