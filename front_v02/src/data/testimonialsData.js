// src/data/testimonialsData.js
// ✅ Default export: array of testimonial objects (seed for TestimonialsStore)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "tm_001"
 *   authorName: string;        // "John Doe"
 *   authorRole: string;        // "Farm Owner, Mbale"
 *   quote: string;             // testimonial text
 *   avatarUrl: string | null;  // optional photo
 *   isFeatured: boolean;       // for homepage carousel
 *   displayOrder: number;      // sort order in admin/public
 *   isActive: boolean;         // published flag
 * }
 */
const testimonialsSeed = [];

export default testimonialsSeed;
