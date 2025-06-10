import axios from "axios";

console.log(import.meta.env.BACKEND_URL);
const apiClient = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
