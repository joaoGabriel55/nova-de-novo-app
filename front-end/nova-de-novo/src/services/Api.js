import axios from 'axios'
const dotenv = require('dotenv');
dotenv.config()

export const API = axios.create({
    baseURL: process.env.REACT_APP_API_BACKEND
})

API.interceptors.request.use(
    config => {
        config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
        return config;
    },
    error => Promise.reject(error)
);

API.interceptors.response.use(
    function (response) {
        return response
    }, function (error) {
        if (error.response.status === 403) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.reload()
        }
        return Promise.reject(error)
    }
)

