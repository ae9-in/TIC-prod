const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? "http://localhost:5000" : "https://ticprodbackendddd.vercel.app");

// Normalize so both "...vercel.app" and "...vercel.app/api" env values work.
const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "").replace(/\/api$/, "");

const getToken = () => localStorage.getItem("auth_token");

const request = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Network error: could not reach server");
  }

  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
    }
  }

  if (!response.ok) {
    const message =
      (typeof data?.message === "string" && data.message) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export const authStore = {
  setToken: (token: string) => localStorage.setItem("auth_token", token),
  getToken,
  clear: () => localStorage.removeItem("auth_token"),
};

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) => request(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  put: (path: string, body?: unknown) => request(path, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body || {}) }),
  patch: (path: string, body?: unknown) => request(path, { method: "PATCH", body: JSON.stringify(body || {}) }),
};

export const toAbsoluteFileUrl = (fileUrl: string) => {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return `${API_BASE_URL}${fileUrl}`;
};

export { API_BASE_URL };
