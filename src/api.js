import axios from 'axios';

const baseURL = 'http://empatis.local/';
const api = axios.create({ baseURL });

export default api;
