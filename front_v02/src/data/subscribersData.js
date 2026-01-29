// src/data/subscribersData.js
// ✅ Default export: array of newsletter subscribers (seed for SubscribersStore)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "sub_001"
 *   email: string;
 *   createdAt: string;         // ISO timestamp
 *   source: string;            // e.g. "footer_form", "quote_form"
 * }
 *
 * In a real backend this would start empty; here we may seed with a few
 * demo entries later. For now it's an empty array.
 */
const subscribersSeed = [];

export default subscribersSeed;
