// src/data/servicesData.js
// ✅ Default export: array of service objects (seed for ServicesStore)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "svc_001"
 *   slug: string;              // e.g. "biodigester-installation"
 *   name: string;              // display name
 *   tagline: string;           // short marketing line
 *   category: string;          // e.g. "Biogas & Energy"
 *   description: string;       // rich description / HTML-safe text
 *   heroImage: string;         // public path or URL for hero
 *   iconKey: string;           // which icon to show in UI
 *   isFeatured: boolean;       // used on Home/featured sections
 *   features: string[];        // bullet points
 * }
 */
const servicesSeed = [];

export default servicesSeed;
