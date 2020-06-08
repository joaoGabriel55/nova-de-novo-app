import axios from 'axios'
const dotenv = require('dotenv');
dotenv.config()

export const API = axios.create({
    baseURL: process.env.REACT_APP_API_BACKEND
})

