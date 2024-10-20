import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://130.193.41.98:8000/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
