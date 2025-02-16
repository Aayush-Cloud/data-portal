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

    getModuleStatus(machineId) {
        const query = `SELECT Active, Error, Module, Ready 
                       FROM Application 
                       WHERE time > now() - 5s 
                       GROUP BY Module`;
        return axios.post(`${API_URL}/influx/query`, { query });
    },

    getConveyorStatus(machineId) {
        const query = `SELECT Running, Module 
                       FROM Conveyor 
                       WHERE time > now() - 5s 
                       GROUP BY Module`;
        return axios.post(`${API_URL}/influx/query`, { query });
    },

    getRfidData(machineId) {
        const query = `SELECT CarrierID, Code 
                       FROM RfidData 
                       WHERE time > now() - 5s`;
        return axios.post(`${API_URL}/influx/query`, { query });
    },

    getEmergencyStatus(machineId) {
        const query = `SELECT Pressed, Module 
                       FROM EmergencySwitch 
                       WHERE time > now() - 5s 
                       GROUP BY Module`;
        return axios.post(`${API_URL}/influx/query`, { query });
    }
};