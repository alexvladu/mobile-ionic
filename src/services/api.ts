// import axios from "axios";

// const BASE_URL = "http://localhost:8080/";

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // ia tokenul din localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
