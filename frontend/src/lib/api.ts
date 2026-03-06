const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";
const TOKEN_KEY = "bitacora_token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

type RequestOptions = RequestInit & {
    auth?: boolean;
};

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
    const headers = new Headers(init.headers);
    const useAuth = init.auth ?? true;

    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (!useAuth) {
        headers.delete("Authorization");
    } else {
        const token = getToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const { auth, ...fetchInit } = init;

    const res = await fetch(`${API_BASE}${path}`, {
        ...fetchInit,
        headers,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.detail || body?.message || res.statusText || `${res.status}`;
        throw new Error(msg);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const api = {
    get: <T>(path: string, auth = true) =>
        request<T>(path, { method: "GET", auth }),

    post: <T>(path: string, body: unknown, auth = true) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body), auth }),

    patch: <T>(path: string, body: unknown, auth = true) =>
        request<T>(path, { method: "PATCH", body: JSON.stringify(body), auth }),

    del: <T>(path: string, auth = true) =>
        request<T>(path, { method: "DELETE", auth }),
};