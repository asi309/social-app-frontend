import axios from 'axios';

const api = axios.create({
  baseURL: 'https://social-app-backend-asi309.herokuapp.com',
});

export default api;
