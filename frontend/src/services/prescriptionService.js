import axios from "axios";

const API_URL = "http://localhost:8081/api/prescriptions";

const getHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
};

const getAllPrescriptions = () => {
    return axios.get(API_URL, { headers: getHeader() });
};

const getPrescriptionById = (id) => {
    return axios.get(`${API_URL}/${id}`, { headers: getHeader() });
};

const getPatientPrescriptions = (patientId) => {
    return axios.get(`${API_URL}/patient/${patientId}`, { headers: getHeader() });
};

const getDoctorPrescriptions = (doctorId) => {
    return axios.get(`${API_URL}/doctor/${doctorId}`, { headers: getHeader() });
};

const getActivePatientPrescriptions = (patientId) => {
    return axios.get(`${API_URL}/patient/${patientId}/active`, { headers: getHeader() });
};

const createPrescription = (prescriptionData) => {
    return axios.post(API_URL, prescriptionData, { headers: getHeader() });
};

const updatePrescription = (id, prescriptionData) => {
    return axios.put(`${API_URL}/${id}`, prescriptionData, { headers: getHeader() });
};

const updateStatus = (id, status) => {
    return axios.patch(`${API_URL}/${id}/status?status=${status}`, {}, { headers: getHeader() });
};

const deletePrescription = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getHeader() });
};

const prescriptionService = {
    getAllPrescriptions,
    getPrescriptionById,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getActivePatientPrescriptions,
    createPrescription,
    updatePrescription,
    updateStatus,
    deletePrescription,
};

export default prescriptionService;
