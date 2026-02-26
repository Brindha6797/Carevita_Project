import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import DoctorSearch from "./components/DoctorSearch";
import HospitalSearch from "./components/HospitalSearch";
import HealthTracker from "./components/HealthTracker";
import HealthDashboard from "./components/HealthDashboard";
import FamilyCircle from "./components/FamilyCircle";
import EmergencySetup from "./components/EmergencySetup";
import PrescriptionList from "./components/PrescriptionList";
import PrescriptionForm from "./components/PrescriptionForm";
import PrescriptionDetails from "./components/PrescriptionDetails";
import Notifications from "./components/Notifications";

// Auth Components
import AdminLogin from "./components/auth/AdminLogin";
import AdminSignup from "./components/auth/AdminSignup";
import UserLogin from "./components/auth/UserLogin";
import UserSignup from "./components/auth/UserSignup";
import DoctorLogin from "./components/auth/DoctorLogin";
import DoctorSignup from "./components/auth/DoctorSignup";
import HospitalLogin from "./components/auth/HospitalLogin";
import HospitalSignup from "./components/auth/HospitalSignup";

import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import HospitalDashboard from "./components/dashboard/HospitalDashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const hasRole = user.roles.some(role => allowedRoles.includes(role));
  return hasRole ? children : <Navigate to="/dashboard" />;
};

const DashboardDispatcher = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const roles = user.roles || [];
  if (roles.includes("ROLE_ADMIN")) return <Navigate to="/admin-dashboard" />;
  if (roles.includes("ROLE_DOCTOR")) return <Navigate to="/doctor-dashboard" />;
  if (roles.includes("ROLE_HOSPITAL") || roles.includes("ROLE_HOSPITAL_ADMIN") || roles.includes("ROLE_RECEPTIONIST")) {
    return <Navigate to="/hospital-dashboard" />;
  }
  return <UserDashboard />;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Navigate to="/login/user" />} />
          <Route path="/signup" element={<Navigate to="/signup/user" />} />

          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/hospital" element={<HospitalLogin />} />

          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/signup/hospital" element={<HospitalSignup />} />

          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            }
          />

          <Route path="/track" element={<RoleProtectedRoute allowedRoles={["ROLE_USER"]}><HealthTracker /></RoleProtectedRoute>} />
          <Route path="/health-dashboard" element={<RoleProtectedRoute allowedRoles={["ROLE_USER"]}><HealthDashboard /></RoleProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><DoctorSearch /></ProtectedRoute>} />
          <Route path="/hospitals" element={<ProtectedRoute><HospitalSearch /></ProtectedRoute>} />
          <Route path="/family" element={<RoleProtectedRoute allowedRoles={["ROLE_USER"]}><FamilyCircle /></RoleProtectedRoute>} />
          <Route path="/emergency" element={<RoleProtectedRoute allowedRoles={["ROLE_USER"]}><EmergencySetup /></RoleProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/hospital-dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />

          <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionList /></ProtectedRoute>} />
          <Route path="/prescriptions/new" element={<ProtectedRoute><PrescriptionForm /></ProtectedRoute>} />
          <Route path="/prescriptions/:id" element={<ProtectedRoute><PrescriptionDetails /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
