import axios, { AxiosInstance } from "axios";

class ExtendableError extends Error {
    constructor(message: string) {
        super(`API Error - ${message}`);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidBearerToken extends ExtendableError {}

class UnexpectedError extends ExtendableError {}

enum UserRole {
    ADMIN = "admin",
    DEVELOPER = "developer",
    OWNER = "owner",
    CUSTOMER = "customer",
    DEFAULT = "default"
}
interface UserProps {
    id: number;
    nickname: string;
    external_id: string | undefined;
    role: UserRole;
	firstName: string;
	lastName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	token: string;
}

class Api {
    public api: AxiosInstance;
    public token: string | undefined;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.BACKEND_ENDPOINT,
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

    public async getToken(): Promise<string | null> {
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

    public async getUserData(): Promise<UserProps> {
        this.getToken();
        try {
            const res = await this.api.get('/data/user');

            if (res.status != 200) {
                throw new UnexpectedError('Unexpected status code: ' + res.status);
            }

            return res.data;
        } catch (err) {
            console.error(err);
            throw new InvalidBearerToken('Authentication Failed');
        }
    }
}

export { InvalidBearerToken, Api };
export type { UserProps, UserRole };
export const api = new Api();