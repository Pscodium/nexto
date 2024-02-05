import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname)
        }
    },
    server: {
        port: 4000,
        host: process.env.HOST_IP,
    },
    define: {
        "process.env.BACKEND_ENDPOINT": JSON.stringify(process.env.BACKEND_ENDPOINT),
        "process.env.HOST_IP": JSON.stringify(process.env.HOST_IP),
        "process.env.FIREBASE_API_KEY": JSON.stringify(process.env.FIREBASE_API_KEY),
        "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        "process.env.FIREBASE_PROJECT_ID": JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        "process.env.FIREBASE_APP_ID": JSON.stringify(process.env.FIREBASE_APP_ID),
        "process.env.FIREBASE_MEASUREMENTE_ID": JSON.stringify(process.env.FIREBASE_MEASUREMENTE_ID),
    },
});
