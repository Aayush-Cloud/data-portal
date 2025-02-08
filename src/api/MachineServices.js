import axios from 'axios';

const API_URL = 'http://localhost:5000/api/machines';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
});

export default {
    // Basic CRUD operations
    getMachines() {
        return axios.get(API_URL, { headers: getAuthHeader() });
    },

    getMachineById(id) {
        return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
    },

    createMachine(data) {
        return axios.post(API_URL, data, { headers: getAuthHeader() });
    },

    updateMachine(id, data) {
        return axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    },

    deleteMachine(id) {
        return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    },

    // InfluxDB specific endpoints
    getInfluxData(id) {
        return axios.get(`${API_URL}/${id}/influx`, { headers: getAuthHeader() });
    },

    getModuleStatus(id) {
        return axios.get(`${API_URL}/${id}/module-status`, { headers: getAuthHeader() });
    },

    getConveyorStatus(id) {
        return axios.get(`${API_URL}/${id}/conveyor`, { headers: getAuthHeader() });
    },

    getRfidData(id) {
        return axios.get(`${API_URL}/${id}/rfid`, { headers: getAuthHeader() });
    },

    getEmergencyStatus(id) {
        return axios.get(`${API_URL}/${id}/emergency`, { headers: getAuthHeader() });
    }
};