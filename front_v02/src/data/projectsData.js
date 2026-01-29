// src/data/projectsData.js
// ✅ Default export: array of project objects (seed for ProjectsStore)

/**
 * Shape (later):
 * {
 *   id: string;                // e.g. "prj_001"
 *   slug: string;              // e.g. "kawanda-biogas-plant"
 *   name: string;              // project title
 *   clientName: string;        // optional
 *   location: string;          // e.g. "Kampala, Uganda"
 *   category: string;          // e.g. "Biogas", "Construction"
 *   summary: string;           // short summary
 *   description: string;       // detailed case-study text
 *   heroImage: string;         // main image path/URL
 *   gallery: string[];         // extra image paths
 *   year: number;              // completion year
 *   isFeatured: boolean;       // for homepage / featured work
 * }
 */
const projectsSeed = [];

export default projectsSeed;
