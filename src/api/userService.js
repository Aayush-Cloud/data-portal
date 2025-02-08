import axios from 'axios';
import AuthService from './auth';

const API_URL = 'http://localhost:5000/api/users';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
});

export default {
    getCurrentUser() {
        return AuthService.getCurrentUser();
    },

    getProfile() {
        return axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
    },

    updateProfile(data) {
        return axios.put(`${API_URL}/profile`, data, { headers: getAuthHeader() });
    }
};