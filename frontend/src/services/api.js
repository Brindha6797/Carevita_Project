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
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
