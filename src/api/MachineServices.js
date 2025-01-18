import axios from 'axios';

const API_URL = 'http://localhost:5000/api/machines';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
});

export default {
    getMachines() {
        return axios.get(API_URL, { headers: getAuthHeader() });
    },

    updateMachine(id, data) {
        return axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    },

    deleteMachine(id) {
        return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    }
};