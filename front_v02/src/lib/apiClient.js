// src/lib/apiClient.js

// ⚠️ LEGACY NETWORK LAYER
// In front_v02 we are moving to a frontend-only architecture.
// All new features should use the *Store* modules (servicesStore, projectsStore, etc.)
// instead of calling this API client. Existing usages will be migrated feature-by-feature.

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

  // ⬇⬇⬇ replace your current `if (!resp.ok) { ... }` with this
  if (!resp.ok) {
    let details = null;
    let text = "";

    try {
      // try structured JSON first
      details = await resp.json();
    } catch {
      // fall back to plain text
      try {
        text = await resp.text();
      } catch {
        text = "";
      }
    }

    const message =
      details?.detail ||
      text ||
      `Request failed with status ${resp.status}`;

    const error = new Error(message);
    error.status = resp.status;
    error.details = details;
    error.rawBody = text;

    // We still throw, but now callers can branch on error.status
    throw error;
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
