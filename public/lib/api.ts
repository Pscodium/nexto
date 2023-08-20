import axios, { AxiosInstance } from "axios";

class ExtendableError extends Error {
    constructor(message: string) {
        super(`API Error - ${message}`);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidBearerToken extends ExtendableError {}

class Api {
    public api: AxiosInstance;
    public token: string | undefined;

    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:3000",
        });
    }

    public async setToken(token: string | undefined) {
        if (!token) {
            return;
        }
        this.token = token;
        localStorage.setItem('BEARER_TOKEN', token);
        this.api.interceptors.request.use(async config => {

            config.headers["Content-Type"] = "application/json";

            if (token) {
                config.headers.Authorization =  `Bearer ${token}`;
            }

            return config;
        });
    }

    public async getToken() {
        const token = localStorage.getItem('BEARER_TOKEN');

        this.api.interceptors.request.use(async config => {

            config.headers["Content-Type"] = "application/json";

            if (token) {
                config.headers.Authorization =  `Bearer ${token}`;
            } else {
                throw new InvalidBearerToken('Invalid Bearer token');
            }

            return config;
        });

        this.token = token || undefined;

        return token;
    }

    public isUserAuthenticated() {
        let hasToken = true;
        const token = localStorage.getItem('BEARER_TOKEN');

        if (!token) {
            hasToken = false;
        }

        return hasToken;
    }
}

export { InvalidBearerToken };
export const api = new Api();