import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        if (response.data?.message) {
            toast.success(response.data.message);
        }
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
        return Promise.reject(error);
    }
);

export default api; 