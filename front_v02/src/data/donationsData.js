// src/data/donationsData.js
// ✅ Default export: array of donation records (seed for DonationsStore)
//
// NOTE: In a real app this would always start empty; here we might
// later seed with a few demo donations for admin dashboard stats.

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "don_001"
 *   campaignId: string | null; // link to a campaign once you add campaignsData
 *   amount: number;            // numeric amount in minor or base units (UGX)
 *   currency: string;          // "UGX", "USD", ...
 *   status: "pending" | "confirmed" | "failed" | "refunded";
 *   paymentMethod: string;     // e.g. "mtn_momo", "airtel_momo", "card"
 *   donorName: string;
 *   donorEmail?: string;
 *   createdAt: string;         // ISO timestamp
 * }
 */
const donationsSeed = [];

export default donationsSeed;
