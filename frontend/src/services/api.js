import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/api"
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    config.headers.Authorization = 'Bearer ' + user.accessToken;
  }
  return config;
});

export default API;
