export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL || "";

export const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_BASE_URL || "";
export const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "";

export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

export const GOD_MODE_URL = encodeURI(`${ADMIN_BASE_URL}${ADMIN_BASE_PATH}/`);

export const INTERNAL_API_BASE_URL = process.env.INTERNAL_API_BASE_URL || "";

export const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "127.0.0.1.nip.io";
