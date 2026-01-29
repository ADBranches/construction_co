// src/data/usersData.js
// ✅ Default export: array of user objects (seed for UsersStore / auth)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "usr_admin"
 *   email: string;             // unique
 *   name: string;
 *   role: "admin" | "staff";   // matches frontend RBAC
 *   isActive: boolean;
 * }
 *
 * In frontend-only mode, we'll pair this with hard-coded credentials
 * in src/lib/auth.js and store "logged in" state in localStorage.
 */
const usersSeed = [];

export default usersSeed;
