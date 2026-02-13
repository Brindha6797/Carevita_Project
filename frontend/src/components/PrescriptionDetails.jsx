import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import prescriptionService from "../services/prescriptionService";

const PrescriptionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUser(currentUser);
        fetchPrescription();
    }, [id]);

    const fetchPrescription = async () => {
        try {
            const response = await prescriptionService.getPrescriptionById(id);
            setPrescription(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching prescription:", error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await prescriptionService.updateStatus(id, newStatus);
            fetchPrescription();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!prescription) return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <p className="text-xl text-gray-500">Prescription not found.</p>
            <button onClick={() => navigate("/prescriptions")} className="mt-4 text-blue-600 hover:underline">
                Back to List
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Prescription Details</h1>
                        <p className="opacity-80">Reference ID: #{prescription.id}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold text-sm bg-white/20 backdrop-blur-md`}>
                        {prescription.status}
                    </div>
                </div>

                <div className="p-8">
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Patient Information</h3>
                            <p className="text-xl font-bold text-gray-800">{prescription.patientName}</p>
                            <p className="text-gray-500">CareVita Verified Patient</p>
                        </div>
                        <div className="md:text-right">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Doctor Information</h3>
                            <p className="text-xl font-bold text-gray-800">{prescription.doctorName || "Dr. CareVita"}</p>
                            <p className="text-gray-500">Specialist Healthcare Provider</p>
                        </div>
                    </div>

                    {/* Medication Details */}
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Medication Schedule</h3>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h2 className="text-2xl font-black text-blue-900 mb-2">{prescription.medicine}</h2>
                            <p className="text-lg text-blue-800 mb-6 font-semibold">{prescription.dosage} — {prescription.frequency}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Duration</p>
                                    <p className="font-bold text-gray-800">{prescription.duration || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Prescribed On</p>
                                    <p className="font-bold text-gray-800">{new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Valid Until</p>
                                    <p className="font-bold text-gray-800">{prescription.validUntil ? new Date(prescription.validUntil).toLocaleDateString() : "No Expiry"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Admin Mode</p>
                                    <p className="font-bold text-gray-800">Oral</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Instructions</h3>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl italic">
                                "{prescription.instructions || "Please take as directed by your physician."}"
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Doctor's Notes</h3>
                            <p className="text-gray-700 leading-relaxed bg-amber-50 p-4 rounded-xl">
                                {prescription.notes || "No additional notes provided."}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 print:hidden">
                        <button
                            onClick={() => navigate("/prescriptions")}
                            className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Back to List
                        </button>

                        <button
                            onClick={handlePrint}
                            className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all"
                        >
                            Print Prescription
                        </button>

                        {user && user.roles.includes("ROLE_DOCTOR") && prescription.status === "ACTIVE" && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus("COMPLETED")}
                                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
                                >
                                    Mark Completed
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus("CANCELLED")}
                                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                                >
                                    Cancel Prescription
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Branding */}
                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-400 font-medium">
                        CareVita Digital Health Record Platform &copy; 2026. This is a legally valid electronic prescription.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PrescriptionDetails;
