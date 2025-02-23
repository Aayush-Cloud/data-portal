import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const MACHINE_URL = `${BASE_URL}/machines`;
const SENSOR_URL = `${BASE_URL}/sensors`;

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
});

export default {
    // Basic CRUD operations
    getMachines() {
        return axios.get(MACHINE_URL, { headers: getAuthHeader() });
    },

    getMachineById(id) {
        return axios.get(`${MACHINE_URL}/${id}`, { headers: getAuthHeader() });
    },

    createMachine(data) {
        return axios.post(MACHINE_URL, data, { headers: getAuthHeader() });
    },

    updateMachine(id, data) {
        return axios.put(`${MACHINE_URL}/${id}`, data, { headers: getAuthHeader() });
    },

    deleteMachine(id) {
        return axios.delete(`${MACHINE_URL}/${id}`, { headers: getAuthHeader() });
    },

    // Sensor data endpoints
    getSensorTemperature() {
        return axios.get(`${SENSOR_URL}/temperature`, { 
            headers: getAuthHeader() 
        });
    },

    getSensorPressure() {
        return axios.get(`${SENSOR_URL}/pressure`, { 
            headers: getAuthHeader() 
        });
    },

    // InfluxDB specific endpoints

    getModuleStatus(id) {
        return axios.get(`${MACHINE_URL}/${id}/module-status`, { headers: getAuthHeader() });
    },

    getConveyorStatus(id) {
        return axios.get(`${MACHINE_URL}/${id}/conveyor`, { headers: getAuthHeader() });
    },

    getRfidData(id) {
        return axios.get(`${MACHINE_URL}/${id}/rfid`, { headers: getAuthHeader() });
    },

    getEmergencyStatus(id) {
        return axios.get(`${MACHINE_URL}/${id}/emergency`, { headers: getAuthHeader() });
    },

    async getInfluxData() {
        const response = await axios.get(`${MACHINE_URL}/influx-data`);
        return response.data;
    },

    async getSensorData() {
        const response = await axios.get('http://localhost:5000/api/sensor-data');
        return response.data;
    }
};