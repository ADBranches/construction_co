// src/data/servicesData.js
const servicesSeed = [
  {
    id: "svc_animal_production",
    slug: "animal-production-consultancy",
    name: "Animal Production Consultancy",
    tagline: "Dairy, beef, small ruminants & poultry enterprises.",
    short_description:
      "Expert advisory support on herd planning, feeding systems, housing, breeding and health for dairy, beef, small ruminants and poultry enterprises.",
    hero_image_url:
      "/images/services/animal-production-consultancy_05-hero.webp",
    // 🔁 NEW – at least 3 frames per card
    gallery_images: [
      "/images/services/animal-production-consultancy_05-hero.webp",
      "/images/projects/farm-construction_02.webp",
      "/images/projects/farm-construction_03.webp",
    ],
    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    id: "svc_waste_management",
    slug: "farm-and-household-waste-management",
    name: "Farm & Household Waste Management",
    tagline: "Close the loop on organic waste on your farm.",
    short_description:
      "Design of integrated waste handling and treatment systems for farms, institutions and households.",
    hero_image_url:
      "/images/services/farm-and-household-waste-management_05-hero.webp",
    gallery_images: [
      "/images/projects/farm-and-household-waste-management_01.webp",
      "/images/projects/farm-and-household-waste-management_02.webp",
      "/images/projects/farm-and-household-waste-management_03.webp",
    ],
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: "svc_biodigester_installation",
    slug: "biodigester-installation",
    name: "Biodigester Installation",
    tagline: "Fixed dome & prefabricated biodigesters for clean energy.",
    short_description:
      "Design and installation of fixed dome and prefabricated biodigesters, sized to your herd and waste streams.",
    hero_image_url:
      "/images/services/biodigester-installation_02-hero.webp",
    gallery_images: [
      "/images/projects/biodigester-installation_01.webp",
      "/images/projects/biodigester-installation_02.webp",
      "/images/projects/biodigester-installation_03.webp",
    ],
    is_featured: true,
    is_active: true,
    display_order: 3,
  },
  {
    id: "svc_biogas_appliances",
    slug: "biogas-appliances-supply",
    name: "Supply of Biogas Appliances",
    tagline: "Complete biogas utilisation packages for farms & institutions.",
    short_description:
      "Supply of brooder heaters, generators, compressors, cylinders, analyzers, scrubbers, pressure gauges, boilers, steam generators, pumps and flow meters.",
    hero_image_url:
      "/images/services/biogas-appliances-supply_01-hero.webp",
    gallery_images: [
      "/images/projects/biogas-appliances-supply_01.webp",
      "/images/projects/biogas-appliances-supply_02.webp",
      "/images/projects/biogas-appliances-supply_03.webp",
    ],
    is_featured: false,
    is_active: true,
    display_order: 4,
  },
  {
    id: "svc_capacity_building",
    slug: "capacity-building-services",
    name: "Capacity Building Services",
    tagline: "Livestock and biodigester systems management training.",
    short_description:
      "Training for livestock and biodigester systems management for farmers, operators and extension workers.",
    hero_image_url:
      "/images/services/capacity-building-services_04-hero.webp",
    gallery_images: [
      "/images/projects/capacity-building_01.webp",
      "/images/projects/capacity-building_02.webp",
      "/images/services/capacity-building-services_04-hero.webp",
    ],
    is_featured: false,
    is_active: true,
    display_order: 5,
  },
  {
    id: "svc_pasture_management",
    slug: "pasture-establishment-and-management",
    name: "Pasture Establishment and Management",
    tagline: "Design and management of productive pasture systems.",
    short_description:
      "Pasture layout, species selection and rotational grazing planning for dairy and beef enterprises.",
    hero_image_url:
      "/images/services/pasture-establishment-and-management_05-hero.webp",
    gallery_images: [
      "/images/projects/pasture-establishment_01.webp",
      "/images/projects/pasture-establishment_02.webp",
      "/images/services/pasture-establishment-and-management_05-hero.webp",
    ],
    is_featured: false,
    is_active: true,
    display_order: 6,
  },
];

export default servicesSeed;
