// src/data/campaignsData.js
// Seed data for donation campaigns (front-only mode).

const nowIso = new Date().toISOString();

const campaignsSeed = [
  {
    id: "cmp_schools",
    name: "Biogas for Schools",
    slug: "biogas-for-schools",
    description:
      "Help us install biogas systems in schools across Uganda.",
    target_amount: 100000000,
    raised_amount: 0,
    status: "active",
    isActive: true,
    createdAt: nowIso,
    updatedAt: nowIso,
  },
  {
    id: "cmp_households",
    name: "Household Biodigesters",
    slug: "household-biodigesters",
    description:
      "Support biodigester systems for low-income households.",
    target_amount: 50000000,
    raised_amount: 0,
    status: "draft",
    isActive: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  },
];

export default campaignsSeed;
