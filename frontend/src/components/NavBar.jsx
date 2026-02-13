import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-logo">CareVita</Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/track" className="nav-link">Log Health</Link>
            <Link to="/health-dashboard" className="nav-link">Insights</Link>
            <Link to="/doctors" className="nav-link">Specialists</Link>
            <Link to="/family" className="nav-link">Family</Link>
            <Link to="/emergency" className="nav-link">Emergency</Link>
            <Link to="/prescriptions" className="nav-link">Prescriptions</Link>
            <Link to="/apply" className="nav-link">Apply</Link>
            <Link to="/view" className="nav-link">Records</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link btn-summary" style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px'
            }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
