import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://lost-found-u86a.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Instead of redirecting to a page that doesn't exist, we let the UI handle it
      console.warn("Unauthorized: Session cleared");
    }
    return Promise.reject(error);
  }
);

export default apiClient;