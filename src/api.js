import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://orda2.api.enes.tech/',
  timeout: 1000,
  headers: {
    'Accept-Language': 'ru',
  },
});

export default instance;
