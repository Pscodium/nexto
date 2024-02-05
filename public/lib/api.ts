/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import axios, { AxiosInstance, AxiosError } from "axios";

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

type UserPermissions = {
    [key: string]: boolean;
} & {
    master_admin_level: boolean;
    can_manage_roles: boolean;
    can_manage_users: boolean;
    can_delete_user: boolean;
    can_add_user: boolean;
    can_edit_user: boolean;
    can_access_dashboard: boolean;
    can_see_map: boolean;
    can_edit_map: boolean;
    can_manage_users_permissions: boolean;
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
    permission: UserPermissions;
}

interface RegisterProps {
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    password: string | undefined;
    nickname: string | undefined;
}

interface PaginatedQuery {
    limit?: number;
    page?: number;
}

class Api {
    public api: AxiosInstance;
    public token: string | undefined;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.BACKEND_ENDPOINT,
        });
    }

    public navigator(route: string) {
        window.location.href = route;
    }

    public async unexpectedError(message: string) {
        throw new UnexpectedError(message);
    }

    public catchTokenError(err: AxiosError) {
        if (err.response) {
            if (err.response.status === 401) {
                this.navigator('/login');
                console.error(err.message);
            }
        }
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
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });
    }

    public async removeToken() {
        localStorage.removeItem('BEARER_TOKEN');
    }

    public async getToken(): Promise<string | null> {
        const token = localStorage.getItem('BEARER_TOKEN');

        this.api.interceptors.request.use(async config => {

            config.headers["Content-Type"] = "application/json";

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                this.navigator('/login');
                throw new InvalidBearerToken('Invalid Bearer token');
            }

            return config;
        });

        this.token = token || undefined;

        return token;
    }

    public async isUserAuthenticated(): Promise<boolean> {
        const token = localStorage.getItem('BEARER_TOKEN');
        if (!token) {
            return false;
        }
        await this.setToken(token);
        try {
            const res = await this.api.get('/data/user');

            if (res.status != 200) {
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public async getUserData(): Promise<UserProps | undefined> {
        try {
            await this.getToken();
            const res = await this.api.get('/data/user');

            if (res.status === 401) {
                this.navigator('/login');
                throw new InvalidBearerToken('[Authentication Error] - Invalid token');
            }

            if (res.status != 200) {
                this.navigator('/login');
                throw new UnexpectedError('Unexpected status code: ' + res.status);
            }

            return res.data;
        } catch (err: any) {
            this.catchTokenError(err);
        }

    }

    public async logout(): Promise<boolean> {
        await this.getToken();

        const res = await this.api.get('/session/logout');

        this.removeToken();
        if (res.status != 200) {
            throw new UnexpectedError('Unexpected status code: ' + res.status);
        }

        return res.data.success;
    }

    public async getUsers(): Promise<UserProps[]> {
        await this.getToken();

        const res = await this.api.get('/users');

        if (res.status != 200) {
            throw new UnexpectedError('Unexpected status code: ' + res.status);
        }

        return res.data;
    }

    public async getUserByExternalId(externalId: string | undefined): Promise<UserProps> {
        await this.getToken();

        const res = await this.api.get(`/user/firebase/${externalId}`);

        if (res.status != 200) {
            throw new UnexpectedError('Unexpected status code: ' + res.status);
        }

        return res.data;
    }

    public async updateUserPerms(userId: number, data: UserPermissions) {
        this.getToken();

        const res = await this.api.post(`/permission/insert/${userId}`, data);

        if (res.status != 200) {
            throw new UnexpectedError('Unexpected status code: ' + res.status);
        }

        return res.data;
    }

    public async deleteUser(userId: number | undefined) {
        this.getToken();

        const res = await this.api.delete(`/user/${userId}`);

        if (res.status !== 200) {
            this.unexpectedError('Unexpected error deleting user');
        }

        return res.data;
    }
}

export { InvalidBearerToken, Api };
export type { UserProps, UserRole, PaginatedQuery, UserPermissions, RegisterProps };
export const api = new Api();