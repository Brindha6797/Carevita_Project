import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import prescriptionService from "../services/prescriptionService";
import { useNavigate } from "react-router-dom";

const PrescriptionForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",
        patientName: "",
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        notes: "",
        validUntil: "",
        status: "ACTIVE"
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.roles.includes("ROLE_DOCTOR")) {
            navigate("/dashboard");
            return;
        }
        setUser(currentUser);
        setFormData(prev => ({ ...prev, doctorName: currentUser.username }));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // In a real app, we'd have a patient selector that sets patientId
            // For now, we'll simulate or just send the name
            const payload = {
                ...formData,
                doctor: { id: user.id },
                // patient: { id: formData.patientId } // Uncomment when patient selection is implemented
                doctorName: user.username,
                prescriptionDate: new Date().toISOString()
            };

            await prescriptionService.createPrescription(payload);
            navigate("/prescriptions");
        } catch (err) {
            console.error("Error creating prescription:", err);
            setError("Failed to create prescription. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
                    <h2 className="text-2xl font-bold">New Prescription</h2>
                    <p className="text-blue-100 opacity-90">Create a new medication plan for your patient</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                required
                                value={formData.patientName}
                                onChange={handleChange}
                                placeholder="Enter patient's full name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name</label>
                            <input
                                type="text"
                                name="medicine"
                                required
                                value={formData.medicine}
                                onChange={handleChange}
                                placeholder="e.g. Paracetamol"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage</label>
                            <input
                                type="text"
                                name="dosage"
                                required
                                value={formData.dosage}
                                onChange={handleChange}
                                placeholder="e.g. 500mg"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                            <select
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="">Select Frequency</option>
                                <option value="Once daily">Once daily</option>
                                <option value="Twice daily">Twice daily</option>
                                <option value="Three times daily">Three times daily</option>
                                <option value="Four times daily">Four times daily</option>
                                <option value="Every 4 hours">Every 4 hours</option>
                                <option value="Before sleep">Before sleep</option>
                                <option value="As needed (PRN)">As needed (PRN)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g. 7 days"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        <div className="input-group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
                            <input
                                type="date"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                        <textarea
                            name="instructions"
                            rows="3"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Add specific intake instructions..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes (Optional)</label>
                        <textarea
                            name="notes"
                            rows="2"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any extra observations or advice..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/prescriptions")}
                            className="flex-1 py-4 px-6 border border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-[2] py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:translate-y-0`}
                        >
                            {loading ? "Creating..." : "Save Prescription"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PrescriptionForm;
