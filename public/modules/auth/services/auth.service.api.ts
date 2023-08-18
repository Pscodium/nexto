import { api } from "../../../lib/api";

interface RegisterProps {
    email: string | undefined;
	firstName: string | undefined;
	lastName: string | undefined;
	password: string | undefined;
}

class AuthServiceApi {
    async register({ email, firstName, lastName, password}: RegisterProps) {
        const res = await api.api.post('/register', {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
        });

        if (res.status !== 200) {
            throw new Error("Unexpected error creating account");
        }

        return res.data;
    }
}

export const authServiceApi = new AuthServiceApi();