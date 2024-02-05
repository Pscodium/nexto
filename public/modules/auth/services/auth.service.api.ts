import { Api } from "../../../lib/api";

interface RegisterProps {
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    password: string | undefined;
    nickname: string | undefined;
}

class ExtendableError extends Error {
    constructor(message: string) {
        super(`API Error: ${message}`);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidEmail extends ExtendableError {}

class AuthServiceApi extends Api {
    async register({ email, firstName, lastName, password, nickname }: RegisterProps) {
        const res = await this.api.post('/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            nickname: nickname
        });

        if (res.status === 409) {
            throw new InvalidEmail('Email is already being used');
        }

        if (res.status !== 200) {
            this.unexpectedError('Unexpected error creating account');
        }

        return res.data;
    }

    async login(email: string | undefined, password: string | undefined ) {
        const res = await this.api.post('/session/login', {
            email: email,
            password: password
        });

        if (res.status !== 200) {
            this.unexpectedError('Unexpected error logging account');
        }

        if (res.data.token) {
            await this.setToken(res.data.token);
        }

        return res.data;
    }
}

export { InvalidEmail };
export const authServiceApi = new AuthServiceApi();