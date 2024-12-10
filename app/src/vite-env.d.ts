/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_URL: string;
	readonly VITE_TRANSACK_API: string;
	readonly VITE_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}


type TokenAddress = `0x${string}`;
type TODO = any;
