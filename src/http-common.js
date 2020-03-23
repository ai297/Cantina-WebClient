import axios from 'axios';
import {API_URL} from './constants.js';

export const HTTP = axios.create({
    baseURL: API_URL.ROOT,
    headers: {
        'Content-Type': "application/json"
    },
    //withCredentials: true
})