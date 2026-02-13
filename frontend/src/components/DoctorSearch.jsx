import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BookingModal from "./BookingModal";

const DoctorSearch = () => {
    const [doctors, setDoctors] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDoctors = async (searchQuery = "") => {
        setLoading(true);
        try {
            const endpoint = searchQuery ? `/doctors/search?query=${searchQuery}` : "/doctors/all";
            const res = await API.get(endpoint);
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDoctors(query);
    };

    return (
        <div className="search-container" style={{ padding: '40px 5%' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-header"
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '16px' }}>Find Your Specialist</h2>
                <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Search by specialization (e.g., Cardiologist)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary"
                        type="submit"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        Search
                    </motion.button>
                </form>
            </motion.div>

            <div className="doctors-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                <AnimatePresence>
                    {doctors.map((doctor) => (
                        <motion.div
                            key={doctor.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -8 }}
                            className="doctor-card"
                            style={{
                                background: 'var(--glass)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '24px',
                                padding: '24px',
                                border: '1px solid var(--glass-border)',
                                boxShadow: 'var(--shadow)',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedDoctor(doctor)}
                        >
                            <div className="doctor-badge" style={{
                                background: 'rgba(79, 70, 229, 0.1)',
                                color: 'var(--primary)',
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                display: 'inline-block',
                                marginBottom: '12px'
                            }}>
                                {doctor.specialization}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{doctor.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{doctor.hospitalName}</p>

                            <div className="doctor-stats" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</span>
                                    <span style={{ fontWeight: '600' }}>{doctor.experience}+ Years</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation</span>
                                    <span style={{ fontWeight: '600' }}>${doctor.consultationFee}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <motion.button
                                    className="btn-primary"
                                    style={{ flex: 1, marginTop: '20px', border: 'none', fontSize: '0.9rem', padding: '12px' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDoctor(doctor);
                                    }}
                                >
                                    Book Now
                                </motion.button>
                                {JSON.parse(localStorage.getItem("user"))?.roles.includes("ROLE_DOCTOR") && (
                                    <Link
                                        to="/prescriptions/new"
                                        className="btn-secondary"
                                        style={{
                                            flex: 1,
                                            marginTop: '20px',
                                            fontSize: '0.9rem',
                                            padding: '12px',
                                            textAlign: 'center',
                                            textDecoration: 'none'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Prescribe
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
};

export default DoctorSearch;
