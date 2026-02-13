import React, { useState } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const BookingModal = ({ doctor, onClose }) => {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBooking = async () => {
        setLoading(true);
        try {
            await API.post("/appointments/book", {
                doctor: { id: doctor.id },
                appointmentDate: date,
                appointmentTime: time,
                reason: reason
            });
            alert("Appointment booked successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to book appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const slots = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'white', padding: '32px', borderRadius: '32px',
                    width: '90%', maxWidth: '500px', position: 'relative'
                }}
            >
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px', border: 'none',
                    background: 'none', fontSize: '1.5rem', cursor: 'pointer'
                }}>&times;</button>

                <h3 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Book Appointment</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>with {doctor.name}</p>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}
                        />
                        <button
                            className="btn-primary"
                            disabled={!date}
                            onClick={() => setStep(2)}
                            style={{ width: '100%', border: 'none' }}
                        >
                            Next Step
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Select Time Slot</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                            {slots.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setTime(slot)}
                                    style={{
                                        padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0',
                                        background: time === slot ? 'var(--primary)' : 'white',
                                        color: time === slot ? 'white' : 'inherit',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>Back</button>
                            <button
                                className="btn-primary"
                                disabled={!time}
                                onClick={() => setStep(3)}
                                style={{ flex: 1, border: 'none' }}
                            >
                                Next Step
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Reason for Visit</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="E.g. Routine checkup, persistsent headache..."
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', height: '100px', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1 }}>Back</button>
                            <button
                                className="btn-primary"
                                disabled={loading || !reason}
                                onClick={handleBooking}
                                style={{ flex: 1, border: 'none' }}
                            >
                                {loading ? "Confirming..." : "Confirm Booking"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default BookingModal;
