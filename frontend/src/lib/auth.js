// src/lib/auth.js
import { apiRequest } from "./api";

/**
 * ===============================
 * Constants
 * ===============================
 */
const TOKEN_KEY = "access_token";
const ADMIN_EMAIL_KEY = "admin_email";

/**
 * ===============================
 * Token Helpers
 * ===============================
 */
function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * ===============================
 * Admin Metadata Helpers
 * ===============================
 */
function setAdminEmail(email) {
  if (email) {
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
  }
}

function getAdminEmail() {
  return localStorage.getItem(ADMIN_EMAIL_KEY) || "";
}

/**
 * ===============================
 * Auth State Helpers
 * ===============================
 */
function isLoggedIn() {
  return !!getToken();
}

/**
 * ===============================
 * Authentication Actions
 * ===============================
 */
async function login(email, password) {
  const payload = new URLSearchParams();
  payload.append("username", email);
  payload.append("password", password);

  const data = await apiRequest("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  if (data?.access_token) {
    saveToken(data.access_token);
    setAdminEmail(email);

    // 🔥 NEW: Fetch /auth/me to get role + is_superuser
    const me = await apiRequest("/api/v1/auth/me", {
      method: "GET",
      headers: authHeader(),
    });

    localStorage.setItem("role", me.role);
    localStorage.setItem("is_superuser", me.is_superuser ? "1" : "0");
  }

  return data;
}

function logout() {
  removeToken();
  localStorage.removeItem(ADMIN_EMAIL_KEY);
  window.location.href = "/admin/login";
}

/**
 * ===============================
 * API Header Helper
 * ===============================
 */
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * ===============================
 * Current User Helpers (RBAC)
 * ===============================
 */
async function getCurrentUser() {
  const headers = authHeader();
  if (!headers.Authorization) return null;

  try {
    const data = await apiRequest("/api/v1/auth/me", {
      method: "GET",
      headers,
    });

    // 🔥 Keep localStorage synced
    localStorage.setItem("role", data.role);
    localStorage.setItem("is_superuser", data.is_superuser ? "1" : "0");

    return data;
  } catch {
    removeToken();
    localStorage.removeItem("role");
    localStorage.removeItem("is_superuser");
    return null;
  }
}

function isAdmin(user) {
  if (!user) return false;

  const storedRole = localStorage.getItem("role");
  const storedSuper = localStorage.getItem("is_superuser") === "1";

  return storedSuper || storedRole === "admin";
}


/**
 * ===============================
 * Route Guard
 * ===============================
 */
function requireAdmin() {
  const token = getToken();
  if (!token) {
    window.location.href = "/admin/login";
  }
}

/**
 * ===============================
 * NAMED EXPORTS
 * ===============================
 */
export {
  login,
  logout,
  getToken,
  getAdminEmail,
  requireAdmin,
  authHeader,
  isLoggedIn,
  getCurrentUser,
  isAdmin,
};

/**
 * ===============================
 * DEFAULT EXPORT (for legacy imports)
 * ===============================
 */
const auth = {
  login,
  logout,
  getToken,
  getAdminEmail,
  requireAdmin,
  authHeader,
  isLoggedIn,
  getCurrentUser,
  isAdmin,
};

export default auth;
