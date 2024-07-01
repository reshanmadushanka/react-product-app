// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const register = (name, email, password, password_confirmation, phone) => {
    return axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
        phone
    });
};

const verifyOTP = (idToken) => {
    return axios.post(`${API_URL}/verify-otp`, { idToken });
};

export { register, verifyOTP };
