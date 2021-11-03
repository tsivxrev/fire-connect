import axios from 'axios';

const senet = axios.create({
  baseURL: 'https://orda2.api.enes.tech/',
  timeout: 10000, // это было причиной моих долгих страданий
  headers: {
    'Accept-Language': 'ru',
  },
});

const api = axios.create({
  baseURL: 'https://fire.nitroauth.workers.dev/',
  timeout: 10000,
});

export { senet, api };
