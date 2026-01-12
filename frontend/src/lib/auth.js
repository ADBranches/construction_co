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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  });

  if (data?.access_token) {
    saveToken(data.access_token);
    setAdminEmail(email);
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
 * API Header Helper
 * ===============================
 */
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * ===============================
 * NAMED EXPORTS (for direct imports)
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
};

export default auth;
