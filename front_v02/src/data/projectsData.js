// src/data/projectsData.js
// ✅ Default export: array of project objects (seed for ProjectsStore)

const projectsSeed = [
  {
    id: "prj_kasese_biodigester_2024",
    slug: "kasese-biodigester-dairy-farm",

    // for admin / backend-ish shape
    title: "50m³ Biodigester for Dairy Farm",
    summary:
      "Designed and installed a 50m³ biodigester to convert zero-grazing dairy waste into biogas for cooking and hot water.",

    // for frontend cards
    name: "50m³ Biodigester for Dairy Farm",
    short_description:
      "50m³ fixed-dome plant treating dairy waste and providing biogas for cooking and hot water on a zero-grazing farm.",

    // hero / cover images
    cover_image_url: "/images/projects/biodigester-installation_01.webp",
    hero_image_url: "/images/projects/biodigester-installation_01.webp",

    // 3-image gallery for animated card
    gallery_images: [
      "/images/projects/biodigester-installation_01.webp",
      "/images/projects/biodigester-installation_02.webp",
      "/images/projects/biodigester-installation_03.webp",
    ],

    // keep service + meta but no location/address text
    service_slug: "biodigester-installation",
    status: "completed",
    year: 2024,

    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    id: "prj_wakiso_biogas_appliances",
    slug: "wakiso-biogas-appliances-upgrade",

    title: "Biogas Appliances Upgrade",
    summary:
      "Supplied and installed new biogas burners, generator and safety fittings for an existing digester system.",

    name: "Biogas Appliances Upgrade",
    short_description:
      "Replacement of old burners with high-efficiency stoves, a biogas-ready generator and upgraded safety fittings.",

    cover_image_url: "/images/projects/biogas-appliances-supply_01.webp",
    hero_image_url: "/images/projects/biogas-appliances-supply_01.webp",

    gallery_images: [
      "/images/projects/biogas-appliances-supply_01.webp",
      "/images/projects/biogas-appliances-supply_02.webp",
      "/images/projects/biogas-appliances-supply_03.webp",
    ],

    service_slug: "biogas-appliances-supply",
    status: "ongoing",
    year: 2023,

    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: "prj_pasture_demo_farm",
    slug: "pasture-demo-farm-kabarole",

    title: "Pasture Establishment Demo Farm",
    summary:
      "Designed and established improved pasture for a mixed dairy-beef enterprise, with rotational grazing blocks.",

    name: "Pasture Establishment Demo Farm",
    short_description:
      "Layout, species selection and grazing plan for improved pasture and fodder conservation on a hillside farm.",

    cover_image_url: "/images/projects/pasture-establishment_01.webp",
    hero_image_url: "/images/projects/pasture-establishment_01.webp",

    gallery_images: [
      "/images/projects/pasture-establishment_01.webp",
      "/images/projects/pasture-establishment_02.webp",
      "/images/projects/farm-and-household-waste-management_01.webp",
    ],

    service_slug: "pasture-establishment-and-management",
    status: "planned",
    year: 2024,

    is_featured: true,
    is_active: true,
    display_order: 3,
  },
];

export default projectsSeed;
