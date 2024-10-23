import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://web:8000/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
