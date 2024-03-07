import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://47.128.73.228:5000/"; // Replace with your actual API base URL

const instance = axios.create({
  baseURL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  // Add additional default configurations here if needed (e.g., headers, interceptors)
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
