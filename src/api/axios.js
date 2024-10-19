// src/api/axios.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Update the base URL if needed
});

export default API;
