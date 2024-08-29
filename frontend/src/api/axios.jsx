// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP , // Fallback in case the environment variable is not set
});

export default instance;
