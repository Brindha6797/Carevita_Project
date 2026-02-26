import React, { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const RequestAppointmentModal = ({ hospital, doctor, onClose, onSuccess }) => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hospital?.id) return;
        setLoading(true);
        try {
            await API.post("/appointments/request", {
                hospitalId: hospital.id,
                doctorId: doctor ? doctor.id : null,
                appointmentDate: date,
                appointmentTime: time,
                dayOfWeek: dayOfWeek || null,
                reason: reason
            });
            alert("Appointment request submitted! You are in waiting state. Reception will confirm or allocate a slot.");
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    if (!hospital?.id) return null;
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: "white", padding: "32px", borderRadius: "24px", width: "90%", maxWidth: "480px", position: "relative" }} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
                <h3 style={{ marginBottom: "8px", color: "var(--primary)" }}>Request Appointment</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.95rem" }}>{hospital?.name} {doctor ? " - " + doctor.name : "(Reception will assign doctor)"}</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={{ marginBottom: "16px" }}><label>Preferred Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} required /></div>
                    <div className="input-group" style={{ marginBottom: "16px" }}><label>Preferred Time</label><select value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }} required><option value="">Select time</option>{timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div className="input-group" style={{ marginBottom: "16px" }}><label>Preferred Day (optional)</label><select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}><option value="">Any</option>{days.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                    <div className="input-group" style={{ marginBottom: "24px" }}><label>Reason / Problem</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe your problem or reason for visit..." rows={3} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: "inherit" }} required /></div>
                    <div style={{ display: "flex", gap: "12px" }}><button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" style={{ flex: 1, border: "none" }} disabled={loading}>{loading ? "Submitting..." : "Submit Request"}</motion.button></div>
                </form>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "16px" }}>You will be in waiting state. Reception will confirm or allocate a slot and notify you.</p>
            </motion.div>
        </div>
    );
};

export default RequestAppointmentModal;
