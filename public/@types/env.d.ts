/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BACKEND_ENDPOINT: string
    readonly HOST_IP: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

