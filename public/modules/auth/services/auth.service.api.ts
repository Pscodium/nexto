import { api } from "../../../lib/api";

interface RegisterProps {
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    password: string | undefined;
}

class ExtendableError extends Error {
    constructor(message: string) {
        super(`API Error: ${message}`);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidEmail extends ExtendableError {}

class AuthServiceApi {
    async register({ email, firstName, lastName, password }: RegisterProps) {
        const res = await api.api.post('/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        });

        if (res.status === 409) {
            throw new InvalidEmail('Email is already being used');
        }

        if (res.status !== 200) {
            throw new Error("Unexpected error creating account");
        }

        return res.data;
    }

    async login(email: string | undefined, password: string | undefined ) {
        const res = await api.api.post('/session/login', {
            email: email,
            password: password
        });

        if (res.status !== 200) {
            throw new Error("Unexpected error logging account");
        }

        if (res.data.token) {
            await api.setToken(res.data.token);
        }

        return res.data;
    }
}

export { InvalidEmail };
export const authServiceApi = new AuthServiceApi();