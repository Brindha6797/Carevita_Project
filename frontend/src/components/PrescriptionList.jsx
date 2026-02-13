import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import prescriptionService from "../services/prescriptionService";
import { Link } from "react-router-dom";

const PrescriptionList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);
        fetchPrescriptions(currentUser);
    }, []);

    const fetchPrescriptions = async (currentUser) => {
        try {
            let response;
            if (currentUser.roles.includes("ROLE_DOCTOR")) {
                response = await prescriptionService.getDoctorPrescriptions(currentUser.id);
            } else {
                response = await prescriptionService.getPatientPrescriptions(currentUser.id);
            }
            setPrescriptions(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            setLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => {
        const matchesFilter = filter === "ALL" || p.status === filter;
        const matchesSearch = p.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.doctorName && p.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.patientName && p.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "ACTIVE": return "text-green-600 bg-green-100";
            case "COMPLETED": return "text-blue-600 bg-blue-100";
            case "EXPIRED": return "text-red-600 bg-red-100";
            case "CANCELLED": return "text-gray-600 bg-gray-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>

                <div className="flex flex-wrap gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search medicines or names..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    {user && user.roles.includes("ROLE_DOCTOR") && (
                        <Link to="/prescriptions/new" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            New Prescription
                        </Link>
                    )}
                </div>
            </div>

            {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-500">No prescriptions found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredPrescriptions.map((p, index) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                                        {p.status}
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {new Date(p.prescriptionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{p.medicine}</h3>
                                <p className="text-blue-600 font-medium mb-4">{p.dosage}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-20 font-medium tracking-tight">Doctor:</span>
                                        <span>{p.doctorName || "Dr. CareVita"}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-20 font-medium tracking-tight">Frequency:</span>
                                        <span>{p.frequency || "As prescribed"}</span>
                                    </div>
                                </div>

                                <Link to={`/prescriptions/${p.id}`} className="block w-full text-center py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                                    View Details
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default PrescriptionList;
