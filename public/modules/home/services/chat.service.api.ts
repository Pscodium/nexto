import { Api } from "../../../lib/api";

interface ChatProps {
    text: string;
    consecutive: boolean;
    firstName?: string;
    lastName?: string;
    createdAt?: number;
    name?: string;
    userId?: number;
    permissionId?: number;
    photoUrl?: string | null;
    uid: string;
}

class ExtendableError extends Error {
    constructor(message: string) {
        super(`API Error: ${message}`);
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class InvalidChat extends ExtendableError {}

class ChatServiceApi extends Api {

    async sendMessage(chat: ChatProps) {
        await this.getToken();

        const res = await this.api.post('/chat/message', {
            consecutive: chat.consecutive,
            text: chat.text,
            uid: chat.uid
        });

        if (res.status === 401) {
            this.navigator('/login');
        }
        if (res.status != 200) {
            throw new InvalidChat("[Chat Error] - Invalid chat error!");
        }

    }
}
export const chatService = new ChatServiceApi();