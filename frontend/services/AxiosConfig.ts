import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://130.193.41.98/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
