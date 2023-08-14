import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use(async config => {
    const token = "68e24865-8b3b-41a0-abca-fa0b89359354";

    config.headers["Content-Type"] = "application/json";

    if (token) {
        config.headers.Authorization =  `Bearer ${token}`;
    }

    return config;
});

export default api;