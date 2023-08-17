import axios, { AxiosInstance } from "axios";

class Api {
    public api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:3000",
        });
        this.initialHeaders();
    }

    private async initialHeaders() {
        this.api.interceptors.request.use(async config => {
            const token = "afe3b1e8-df4b-498e-a036-f06f4597e945";

            config.headers["Content-Type"] = "application/json";

            if (token) {
                config.headers.Authorization =  `Bearer ${token}`;
            }

            return config;
        });

    }
}

export const api = new Api();