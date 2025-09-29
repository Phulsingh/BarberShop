import axios from 'axios';
import { useLoader } from '../contexts/LoadingContext';
const createAxiosInstance = (showLoader: () => void, hideLoader: () => void) => {
    const instance = axios.create({
        baseURL: 'https://localhost:7137/api', // Updated to external API base URL
        timeout: 100000,
        // Remove default Content-Type header
    });
    instance.interceptors.request.use(
        (config) => {
            // Only show loader if showGlobalLoader is not explicitly set to false
            if ((config as any).showGlobalLoader !== false) {
                showLoader();
            }
            const token = localStorage.getItem('AuthToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            // Auto-detect Content-Type based on data
            if (!config.headers['Content-Type']) {
                if (config.data instanceof FormData) {
                    // Let browser set multipart/form-data with boundary
                    delete config.headers['Content-Type'];
                } else {
                    config.headers['Content-Type'] = 'application/json';
                }
            }
            return config;
        },
        (error) => {
            hideLoader();
            return Promise.reject(error);
        }
    );
    instance.interceptors.response.use(
        (response) => {
            // Only hide loader if it was shown (showGlobalLoader was not false)
            if ((response.config as any).showGlobalLoader !== false) {
                hideLoader();
            }
            return response;
        },
        (error) => {
            // Only hide loader if it was shown
            if (error.config && (error.config as any).showGlobalLoader !== false) {
                hideLoader();
            }
            // Handle status 400 as a successful response instead of error
            if (error.response && error.response.status === 400) {
                return Promise.resolve(error.response);
            }
            return Promise.reject(error);
        }
    );
    return instance;
};
export const useAxiosInstance = () => {
    const { showLoader, hideLoader } = useLoader();
    return createAxiosInstance(showLoader, hideLoader);
};
