import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};
