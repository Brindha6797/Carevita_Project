import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phoneNumber: "",
        hospital: "",
        qualification: "",
        experience: ""
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
                role: ["doctor"]
            });
            alert("Doctor profile created successfully!");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{ maxWidth: "600px" }}
            >
                <h2>Doctor Registration</h2>
                <p>Join our medical network on CareVita</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-row" style={{ display: "flex", gap: "15px" }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Doctor Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Dr. Smith"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="8887776665"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-row" style={{ display: "flex", gap: "15px" }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="drsmith"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="doctor@hospital.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Hospital / Clinic Name</label>
                        <input
                            type="text"
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            placeholder="City General Hospital"
                            required
                        />
                    </div>

                    <div className="input-row" style={{ display: "flex", gap: "15px" }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="MBBS, MD"
                                required
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label>Experience (Years)</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="10+"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group password-group">
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
                                {showPassword ? "🔓" : "🔐"}
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
                        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
                    >
                        Complete Registration
                    </motion.button>
                </form>

                <p className="auth-footer">
                    Already registered? <Link to="/login">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default DoctorSignup;
