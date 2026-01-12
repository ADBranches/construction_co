// src/lib/apiClient.js

// Keep this as a named export in case you want to read it elsewhere
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}${path}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    const errorBody = await resp.text().catch(() => "");
    throw new Error(
      `API error ${resp.status} ${resp.statusText} – ${
        errorBody || "no details"
      }`,
    );
  }

  if (resp.status === 204) return null;
  return resp.json();
}

// Main client instance (the “one thing” this module exposes)
const api = {
  get: (path, options) => request(path, options || {}),
  post: (path, body, options) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...(options || {}),
    }),
  put: (path, body, options) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...(options || {}),
    }),
  patch: (path, body, options) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...(options || {}),
    }),
  delete: (path, options) =>
    request(path, {
      method: "DELETE",
      ...(options || {}),
    }),
};

// ✅ default export + optional named export
export default api;
export { API_BASE_URL };
