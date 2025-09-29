import { useAxiosInstance } from '../config/axiosConfig';
export const useApiService = () => {
    const axios = useAxiosInstance();
    const apiService = {
        get: async (endpoint: string, showGlobalLoader: boolean = true) => {
            try {
                const response = await axios.get(endpoint, { showGlobalLoader } as any);
                return response.data;
            } catch (error) {
                const handledError = handleError(error);
                if (handledError && handledError.status === 400) {
                    // Return 400 response data so it's handled in try block
                    return handledError.data;
                }
                throw error;
            }
        },
        post: async (endpoint: string, data: any, showGlobalLoader: boolean = true) => {
            try {
                const response = await axios.post(endpoint, data, { showGlobalLoader } as any);
                return response.data;
            } catch (error) {
                const handledError = handleError(error);
                if (handledError && handledError.status === 400) {
                    // Return 400 response data so it's handled in try block
                    return handledError.data;
                }
                throw error;
            }
        },
 
        put: async (endpoint: string, data: any, showGlobalLoader: boolean = true) => {
            try {
                const response = await axios.put(endpoint, data, { showGlobalLoader } as any);
                return response.data;
            } catch (error) {
                const handledError = handleError(error);
                if (handledError && handledError.status === 400) {
                    // Return 400 response data so it's handled in try block
                    return handledError.data;
                }
                throw error;
            }
        },
        delete: async (endpoint: string, data: any = null, showGlobalLoader: boolean = true) => {
            try {
                const config = { showGlobalLoader } as any;
                if (data) {
                    config.data = data;
                }
                const response = await axios.delete(endpoint, config);
                return response.data;
            } catch (error) {
                const handledError = handleError(error);
                if (handledError && handledError.status === 400) {
                    // Return 400 response data so it's handled in try block
                    return handledError.data;
                }
                throw error;
            }
        },
        patch: async (endpoint: string, data: any, showGlobalLoader: boolean = true) => {
            try {
                const response = await axios.patch(endpoint, data, { showGlobalLoader } as any);
                return response.data;
            } catch (error) {
                const handledError = handleError(error);
                if (handledError && handledError.status === 400) {
                    // Return 400 response data so it's handled in try block
                    return handledError.data;
                }
                throw error;
            }
        }
    };
    const handleError = (error: any) => {
        if (error.response) {
            console.error('Response Error:', error.response.data);
            switch (error.response.status) {
                case 400:
                    // For 400 errors, we want to return the response instead of throwing
                    return error.response;
                case 401:
                    console.error('Unauthorized access - redirecting to login');
                    throw new Error('Unauthorized access');
                case 403:
                    console.error('Access forbidden');
                    throw new Error('Access forbidden');
                case 404:
                    console.error('Resource not found');
                    throw new Error('Resource not found');
                case 405:
                    console.error('Method not allowed - Please check API endpoint configuration');
                    throw new Error('This operation is not supported by the server. Please check API configuration.');
                default:
                    console.error('Server error:', error.response.status);
                    throw new Error(`Server error: ${error.response.status}`);
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
            throw new Error('Network error - Unable to reach the server');
        } else {
            console.error('Error:', error.message);
            throw error;
        }
    };

    return apiService;
};
