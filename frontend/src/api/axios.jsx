// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Ensure this matches your backend port
});

export default instance;
