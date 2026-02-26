import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Payment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 2000);
    };

    return (
        <div style={{ padding: "60px 5%", minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--background)" }}>
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        style={{ background: "white", padding: "40px", borderRadius: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "480px", textAlign: 'center' }}
                    >
                        <div style={{ width: '80px', height: '80px', background: '#e0e7ff', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem' }}>
                            💳
                        </div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: '800', marginBottom: "12px", color: '#1e293b' }}>CareVita Express Pay</h1>
                        <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: '0.95rem' }}>
                            Securely pay for your consultations and medications through our encrypted simulated gateway.
                        </p>

                        <div style={{ textAlign: 'left', display: 'grid', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Card Number</label>
                                <div style={{ fontSize: '1.1rem', letterSpacing: '2px' }}>•••• •••• •••• 4242</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Expiry</label>
                                    <div style={{ fontSize: '1rem' }}>12 / 26</div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>CVV</label>
                                    <div style={{ fontSize: '1rem' }}>•••</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={loading}
                            style={{
                                width: '100%', height: '60px', borderRadius: '20px', background: 'var(--primary)',
                                color: 'white', border: 'none', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                            }}
                        >
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ fontSize: '1.5rem' }}>⌛</motion.div>
                            ) : "Complete Secure Payment"}
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Protected by CareVita Security Protocols. No actual money will be charged.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{ background: "white", padding: "40px", borderRadius: "40px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "480px", textAlign: 'center' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                            style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem' }}
                        >
                            ✅
                        </motion.div>
                        <h1 style={{ fontSize: "1.75rem", fontWeight: '800', marginBottom: "12px", color: '#166534' }}>Payment Successful</h1>
                        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
                            Your transaction has been confirmed. The reception and doctor have been notified.
                        </p>

                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '20px', marginBottom: '32px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ color: '#15803d', fontSize: '0.9rem' }}>Ref ID:</span>
                                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>CV-88219374</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#15803d', fontSize: '0.9rem' }}>Status:</span>
                                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#166534' }}>COMPLETED</span>
                            </div>
                        </div>

                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <button style={{ width: '100%', height: '60px', borderRadius: '20px', background: '#1e293b', color: 'white', border: 'none', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>
                                Return to Dashboard
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payment;

