import axios from 'axios';

export const baseURL = 'https://api.themoviedb.org/3';
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500/';
const TIME_OUT = 15000;

export const API = axios.create({
  baseURL,
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
API.interceptors.request.use(
  async config => {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
API.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    return Promise.reject(err);
  },
);
