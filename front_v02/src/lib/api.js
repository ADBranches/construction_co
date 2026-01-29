// src/lib/api.js

// ⚠️ LEGACY DOMAIN API (BACKEND-BOUND)
// In front_v02 we are migrating to frontend-only Stores:
// - ServicesStore, ProjectsStore, TestimonialsStore, InquiriesStore, SubscribersStore,
//   UsersStore, CampaignsStore, DonationsStore.
// Public + admin UIs will be refactored to call Stores directly.
// Once everything is Store-based, this module will either be removed
// or turned into thin wrappers around the Stores.


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.detail || "Request failed",
      raw: data,
    };
  }

  return data;
}

// SERVICE CRUD
export const ServiceAPI = {
  list: () => apiRequest("/api/v1/services"),
  create: (data) => apiRequest("/api/v1/services", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/v1/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/v1/services/${id}`, { method: "DELETE" }),
};

// PROJECT CRUD
export const ProjectAPI = {
  list: () => apiRequest("/api/v1/projects"),
  getBySlug: (slug) => apiRequest(`/api/v1/projects/${slug}`),
  create: (data) =>
    apiRequest("/api/v1/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiRequest(`/api/v1/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiRequest(`/api/v1/projects/${id}`, {
      method: "DELETE",
    }),
};

// INQUIRIES ADMIN
export const InquiryAPI = {
  list: (queryString = "") => {
    const suffix = queryString ? `?${queryString}` : "";
    return apiRequest(`/api/v1/inquiries${suffix}`);
  },

  updateStatus: (id, status) =>
    apiRequest(
      `/api/v1/inquiries/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: "PATCH",
      }
    ),

  update: (id, data) =>
    apiRequest(`/api/v1/inquiries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
// TESTIMONIALS CMS
export const TestimonialsAPI = {
  // Public-facing list (only active + maybe featured, depending on backend)
  listPublic: () => apiRequest("/api/v1/testimonials"),

  // Admin list – note: `?is_active=` so backend sees None and returns all
  listAdmin: () => apiRequest("/api/v1/testimonials?is_active="),

  create: (data) =>
    apiRequest("/api/v1/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiRequest(`/api/v1/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiRequest(`/api/v1/testimonials/${id}`, {
      method: "DELETE",
    }),
};

// Admin: Users management API (RBAC)
export const UserAPI = {
  list: () => apiRequest("/api/v1/users"),
  updateRole: (id, payload) =>
    apiRequest(`/api/v1/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
