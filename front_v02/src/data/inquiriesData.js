// src/data/inquiriesData.js
// ✅ Default export: array of inquiry objects (seed for InquiriesStore)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "inq_001"
 *   name: string;
 *   email: string;
 *   phone: string;
 *   subject: string;
 *   message: string;
 *   createdAt: string;         // ISO timestamp
 *   status: "new" | "in_progress" | "resolved" | "archived";
 *   source: string;            // e.g. "contact_page", "quote_page"
 * }
 */
const inquiriesSeed = [];

export default inquiriesSeed;
