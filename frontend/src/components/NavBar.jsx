import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import API from "../services/api";


function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notifications/unread-count");
      setUnreadCount(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    setUnreadCount(0);
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

            {/* Patient Only Links */}
            {user.roles.includes("ROLE_USER") && (
              <>
                <Link to="/track" className="nav-link">Log Health</Link>
                <Link to="/health-dashboard" className="nav-link">Insights</Link>
                <Link to="/family" className="nav-link">Family</Link>
                <Link to="/emergency" className="nav-link">Emergency</Link>
              </>
            )}

            {/* Shared Links */}
            <Link to="/hospitals" className="nav-link">Hospitals</Link>
            <Link to="/doctors" className="nav-link">Specialists</Link>
            <Link to="/prescriptions" className="nav-link">Prescriptions</Link>

            <Link to="/notifications" className="nav-link" style={{ position: 'relative' }}>
              Notifications
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-12px',
                    background: '#ef4444', color: 'white',
                    fontSize: '0.65rem', padding: '2px 6px',
                    borderRadius: '10px', fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </Link>


            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login/user" className="nav-link">Login</Link>
            <Link to="/login/hospital" className="nav-link">Hospital Login</Link>
            <Link to="/signup/user" className="nav-link btn-summary" style={{
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
