import API from "./api";

const getAllUsers = () => {
    return API.get("/admin/users");
};

const updateUser = (id, userData) => {
    return API.put(`/admin/users/${id}`, userData);
};

const deleteUser = (id) => {
    return API.delete(`/admin/users/${id}`);
};

const getAllDoctors = () => {
    return API.get("/admin/doctors");
};

const updateDoctor = (id, doctorData) => {
    return API.put(`/admin/doctors/${id}`, doctorData);
};

const deleteDoctor = (id) => {
    return API.delete(`/admin/doctors/${id}`);
};

const AdminService = {
    getAllUsers,
    updateUser,
    deleteUser,
    getAllDoctors,
    updateDoctor,
    deleteDoctor
};

export default AdminService;
