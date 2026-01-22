# app/scripts/seed_services.py

from app.database import SessionLocal
from app.models.service import Service


def upsert_service(db, slug: str, **fields):
    """
    Create or update a Service row based on slug.
    Safe to run multiple times (idempotent).
    """
    service = db.query(Service).filter(Service.slug == slug).first()

    if service:
        for key, value in fields.items():
            setattr(service, key, value)
        print(f"✅ Updated service: {slug}")
    else:
        service = Service(slug=slug, **fields)
        db.add(service)
        print(f"✅ Created service: {slug}")

    return service


def main():
    db = SessionLocal()
    try:
        # 1️⃣ Animal Production consultancy
        upsert_service(
            db,
            "animal-production-consultancy",
            name="Animal Production Consultancy",
            short_description=(
                "Technical guidance on profitable dairy, beef, small ruminant "
                "and poultry enterprises tailored to your farm realities."
            ),
            description=(
                "We support farmers to plan, design and manage animal production "
                "systems for dairy, beef, goats, sheep and poultry. Our consultancy "
                "covers breeding plans, housing, feeding strategies, herd health and "
                "record-keeping so that your farm is productive, profitable and sustainable."
            ),
            tagline="Make every cow, goat and bird work profitably for you.",
            category="animal-production",
            hero_image_url="/images/services/animal-production-consultancy_05-hero.webp",
            icon="animal-production",
            highlight_1="Enterprise planning for dairy, beef, small ruminants and poultry",
            highlight_2="Feed budgeting, housing design and herd health strategies",
            highlight_3="Record-keeping systems for performance and profitability tracking",
            is_active=True,
            display_order=1,
        )

        # 2️⃣ Farm and household waste management
        upsert_service(
            db,
            "farm-and-household-waste-management",
            name="Farm & Household Waste Management",
            short_description=(
                "Turn organic waste into a resource through structured collection, "
                "sorting and treatment strategies."
            ),
            description=(
                "We design waste management solutions for farms and households, focusing "
                "on manure, crop residues and kitchen waste. Our approaches reduce "
                "pollution, odour and disease risk while preparing feedstock for "
                "biodigesters and composting systems."
            ),
            tagline="From waste problem to resource opportunity.",
            category="waste-management",
            hero_image_url="/images/services/farm-and-household-waste-management_05-hero.webp",
            icon="waste-management",
            highlight_1="Assessment of existing waste streams on farm and homestead",
            highlight_2="Design of collection, storage and pre-treatment systems",
            highlight_3="Integration with biodigesters and composting for nutrient recovery",
            is_active=True,
            display_order=2,
        )

        # 3️⃣ Biodigester installation
        upsert_service(
            db,
            "biodigester-installation",
            name="Biodigester Installation",
            short_description=(
                "Design and installation of fixed-dome and prefabricated biodigesters "
                "for reliable biogas and slurry."
            ),
            description=(
                "We size, design and install biodigesters that match your herd size, "
                "waste output and energy needs. Our team handles site assessment, "
                "digester construction or assembly, gas piping, safety fittings and "
                "start-up support, ensuring your system runs safely and efficiently."
            ),
            tagline="Reliable biogas systems, built for East African farms.",
            category="biogas",
            hero_image_url="/images/services/biodigester-installation_02-hero.webp",
            icon="biodigester",
            highlight_1="Fixed-dome and prefabricated biodigesters sized to your farm",
            highlight_2="Complete gas piping, safety valves and pressure protection",
            highlight_3="Commissioning, start-up and early performance monitoring",
            is_active=True,
            display_order=3,
        )

        # 4️⃣ Supply of biogas appliances
        upsert_service(
            db,
            "biogas-appliances-supply",
            name="Biogas Appliances Supply",
            short_description=(
                "Supply and integration of high-quality biogas appliances for heat, "
                "power and process applications."
            ),
            description=(
                "We supply and match biogas appliances to your system capacity and use "
                "cases: brooder heaters, generators, compressors, cylinders, analyzers, "
                "scrubbers, pressure gauges, boilers, steam generators, pumps and "
                "flow meters. Each setup is engineered to be safe, efficient and "
                "compatible with your digester output."
            ),
            tagline="Appliances that let your biogas do real work.",
            category="biogas-appliances",
            hero_image_url="/images/services/biogas-appliances-supply_01-hero.webp",
            icon="appliances",
            highlight_1="Brooder heaters, generators and process heat solutions",
            highlight_2="Scrubbers, analyzers and pressure control accessories",
            highlight_3="Biogas pumps and flow meters for reliable distribution",
            is_active=True,
            display_order=4,
        )

        # 5️⃣ Capacity building services
        upsert_service(
            db,
            "capacity-building-services",
            name="Capacity Building Services",
            short_description=(
                "Hands-on training in livestock production and biodigester systems "
                "management for farmers and operators."
            ),
            description=(
                "We design and deliver practical training programmes on livestock "
                "husbandry, animal welfare, feed management and biodigester operation. "
                "Participants learn how to operate, maintain and troubleshoot both "
                "the animal enterprises and the biogas systems linked to them."
            ),
            tagline="Train your people, stabilize your systems.",
            category="capacity-building",
            hero_image_url="/images/services/capacity-building-services_04-hero.webp",
            icon="training",
            highlight_1="Farmer training on livestock and system management",
            highlight_2="Operator training on biodigester operation and maintenance",
            highlight_3="Short courses, field demonstrations and coaching visits",
            is_active=True,
            display_order=5,
        )

        # 6️⃣ Pasture establishment and management
        upsert_service(
            db,
            "pasture-establishment-and-management",
            name="Pasture Establishment & Management",
            short_description=(
                "Design and management of productive pasture systems to support "
                "your livestock and biogas plans."
            ),
            description=(
                "We support farms to establish and manage improved pastures, from "
                "species selection and field layout to grazing plans and fodder "
                "conservation. Good pastures improve animal performance and supply "
                "consistent manure for biodigesters."
            ),
            tagline="Healthy pastures, stronger herds, better gas.",
            category="pasture-management",
            hero_image_url="/images/services/pasture-establishment-and-management_05-hero.webp",
            icon="pasture",
            highlight_1="Pasture species selection and establishment plans",
            highlight_2="Grazing rotation and fodder conservation strategies",
            highlight_3="Linking pasture plans to manure and biogas targets",
            is_active=True,
            display_order=6,
        )

        db.commit()
        print("✅ All Brisk services seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

