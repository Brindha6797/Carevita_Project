import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="hero-section">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Health, Our Priority
      </motion.h1>

      <motion.p
        className="hero-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        CareVita is a modern healthcare platform designed to bridge the gap between patients and quality care. Book appointments, manage records, and track your health daily.
      </motion.p>

      <motion.div
        className="cta-buttons"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/apply" className="btn-primary">Book Appointment</Link>
        <Link to="/signup" className="btn-secondary">Join Community</Link>
      </motion.div>

      <motion.div
        className="features-grid"
        style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {[
          { title: "24/7 Support", desc: "Always here for your health needs." },
          { title: "Smart Records", desc: "Manage all medical data in one place." },
          { title: "Expert Doctors", desc: "Connect with verified specialists." }
        ].map((f, i) => (
          <div key={i} className="feature-card" style={{
            background: 'var(--glass)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)'
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Home;
