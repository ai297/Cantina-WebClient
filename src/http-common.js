import axios from 'axios';

export const HTTP = axios.create({
    baseURL: 'http://localhost:5000/',  // адрес апи-сервера кантины. Слэш в конце обязательно
    headers: {
        'Content-Type': "application/json"
    }
})