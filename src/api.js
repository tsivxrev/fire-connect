import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://orda2.api.enes.tech/',
  timeout: 10000, // это было причиной моих долгих страданий
  headers: {
    'Accept-Language': 'ru',
  },
});

export default instance;
