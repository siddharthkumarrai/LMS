import axios from "axios";
import { logout } from "../redux/features/auth/authSlice";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Yeh ek setup function hai jise hum baad mein call karenge
export const setupAxiosInterceptors = (store) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;
            if (status === 401) {
                // Yeh function store ko use karke user ko logout kar dega
                store.dispatch(logout());
                toast.error("Session expired, please login again.");
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInstance;