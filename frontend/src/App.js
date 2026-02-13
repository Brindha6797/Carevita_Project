import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import ApplyForm from "./components/ApplyForm";
import DisplayData from "./components/DisplayData";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DoctorSearch from "./components/DoctorSearch";
import Dashboard from "./components/Dashboard";
import HealthTracker from "./components/HealthTracker";
import HealthDashboard from "./components/HealthDashboard";
import FamilyCircle from "./components/FamilyCircle";
import EmergencySetup from "./components/EmergencySetup";
import PrescriptionList from "./components/PrescriptionList";
import PrescriptionForm from "./components/PrescriptionForm";
import PrescriptionDetails from "./components/PrescriptionDetails";

// New Auth Components
import AdminLogin from "./components/auth/AdminLogin";
import AdminSignup from "./components/auth/AdminSignup";
import UserLogin from "./components/auth/UserLogin";
import UserSignup from "./components/auth/UserSignup";
import DoctorLogin from "./components/auth/DoctorLogin";
import DoctorSignup from "./components/auth/DoctorSignup";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
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

          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />

          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <HealthTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-dashboard"
            element={
              <ProtectedRoute>
                <HealthDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <DoctorSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/family"
            element={
              <ProtectedRoute>
                <FamilyCircle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EmergencySetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <ApplyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view"
            element={
              <ProtectedRoute>
                <DisplayData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <PrescriptionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/new"
            element={
              <ProtectedRoute>
                <PrescriptionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/:id"
            element={
              <ProtectedRoute>
                <PrescriptionDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
