import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://event-management-4n0n.onrender.com/api',
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
