# app/scripts/seed_projects.py

from uuid import uuid4

from app.database import SessionLocal
from app.models.project import Project, ProjectStatus
from app.models.service import Service
from app.models.media import Media


def upsert_project(db, slug: str, **fields):
    """
    Create or update a project based on slug.
    SAFE TO RUN MULTIPLE TIMES — idempotent.
    """
    project = db.query(Project).filter(Project.slug == slug).first()

    if project:
        for key, value in fields.items():
            setattr(project, key, value)
        print(f"🔄 Updated project: {slug}")
    else:
        project = Project(slug=slug, **fields)
        db.add(project)
        print(f"✨ Created project: {slug}")

    return project


def attach_media(db, project, urls: list[str]):
    """
    Replace project media items with given URLs.
    NOTE: Media model currently has no `caption` field,
    so we only pass fields that actually exist.
    """
    db.query(Media).filter(Media.project_id == project.id).delete()

    for url in urls:
        media = Media(
            id=uuid4(),
            project_id=project.id,
            url=url,
            # caption=project.name,  # ❌ removed – model has no `caption` field
        )
        db.add(media)

    print(f"🖼  Attached {len(urls)} media → {project.slug}")


def find_service(db, slug: str):
    svc = db.query(Service).filter(Service.slug == slug).first()
    if not svc:
        raise Exception(f"Service '{slug}' not found. Seed services first.")
    return svc


def main():
    db = SessionLocal()

    try:
        # ---------------------------------------------------------
        # 1️⃣ BIODIGESTER INSTALLATION (FEATURED)
        # ---------------------------------------------------------
        biodigester_service = find_service(db, "biodigester-installation")

        p1 = upsert_project(
            db,
            slug="biodigester-installation-kisoro",
            name="Biodigester Installation — Kisoro Dairy Farm",
            description=(
                "A complete fixed-dome biodigester system installed for a mid-sized "
                "dairy farm to supply cooking and heating energy."
            ),
            short_description="Complete fixed-dome digester supplying cooking & heating energy.",
            location="Kisoro, Uganda",
            status=ProjectStatus.COMPLETED,
            is_featured=True,
            service_id=biodigester_service.id,
            cover_image_url="/images/projects/biodigester-installation_01.webp",
            client_name="Kisoro Dairy Cooperative",
            # budget / dates left NULL for now
        )

        attach_media(
            db,
            p1,
            [
                "/images/projects/biodigester-installation_01.webp",
                "/images/projects/biodigester-installation_02.webp",
                "/images/projects/biodigester-installation_03.webp",
            ],
        )

        # ---------------------------------------------------------
        # 2️⃣ BIOGAS APPLIANCES SUPPLY (FEATURED)
        # ---------------------------------------------------------
        biogas_app_service = find_service(db, "biogas-appliances-supply")

        p2 = upsert_project(
            db,
            slug="biogas-appliances-upgrade-mbarara",
            name="Biogas Appliances Upgrade — Mbarara Poultry Farm",
            description=(
                "Installed brooder heaters, analyzers and pressure control accessories "
                "for improved biogas application on a commercial poultry unit."
            ),
            short_description="Heaters, analyzers & pressure control upgrade for biogas use.",
            location="Mbarara, Uganda",
            status=ProjectStatus.COMPLETED,
            is_featured=True,
            service_id=biogas_app_service.id,
            cover_image_url="/images/projects/biogas-appliances-supply_01.webp",
            client_name="Mbarara Poultry Hub",
        )

        attach_media(
            db,
            p2,
            [
                "/images/projects/biogas-appliances-supply_01.webp",
                "/images/projects/biogas-appliances-supply_02.webp",
                "/images/projects/biogas-appliances-supply_03.webp",
            ],
        )

        # ---------------------------------------------------------
        # 3️⃣ WASTE MANAGEMENT (FEATURED)
        # ---------------------------------------------------------
        waste_mgmt_service = find_service(
            db, "farm-and-household-waste-management"
        )

        p3 = upsert_project(
            db,
            slug="waste-management-nabingo",
            name="Farm Waste Management System — Nabingo Homestead",
            description=(
                "Designed structured waste collection and storage system preparing "
                "feedstock for composting and biodigesters."
            ),
            short_description="Waste stream mapping & storage system for composting.",
            location="Nabingo, Uganda",
            status=ProjectStatus.ONGOING,
            is_featured=True,
            service_id=waste_mgmt_service.id,
            cover_image_url="/images/projects/farm-and-household-waste-management_01.webp",
            client_name="Nabingo Mixed Farm",
        )

        attach_media(
            db,
            p3,
            [
                "/images/projects/farm-and-household-waste-management_01.webp",
                "/images/projects/farm-and-household-waste-management_02.webp",
            ],
        )

        # ---------------------------------------------------------
        # 4️⃣ CAPACITY BUILDING (NON-FEATURED)
        # ---------------------------------------------------------
        training_service = find_service(db, "capacity-building-services")

        p4 = upsert_project(
            db,
            slug="capacity-building-bushenyi",
            name="Capacity Building Training — Bushenyi Farmers Group",
            description=(
                "Hands-on training in livestock production, biodigester operation, "
                "and feed management for farmer groups."
            ),
            short_description="Training in biodigester operation & livestock production.",
            location="Bushenyi, Uganda",
            status=ProjectStatus.COMPLETED,
            is_featured=False,
            service_id=training_service.id,
            cover_image_url="/images/projects/capacity-building_01.webp",
            client_name="Bushenyi Farmers Cooperative",
        )

        attach_media(
            db,
            p4,
            [
                "/images/projects/capacity-building_01.webp",
                "/images/projects/capacity-building_02.webp",
            ],
        )

        # ---------------------------------------------------------
        # 5️⃣ PASTURE DEVELOPMENT (NON-FEATURED)
        # ---------------------------------------------------------
        pasture_service = find_service(
            db, "pasture-establishment-and-management"
        )

        p5 = upsert_project(
            db,
            slug="pasture-establishment-kabarole",
            name="Pasture Establishment — Kabarole Zero-Grazing Unit",
            description=(
                "Improved fodder systems, grazing plans and conservation strategy to "
                "support zero-grazing dairy units."
            ),
            short_description="Improved fodder systems & grazing plans.",
            location="Kabarole, Uganda",
            status=ProjectStatus.COMPLETED,
            is_featured=False,
            service_id=pasture_service.id,
            cover_image_url="/images/projects/pasture-establishment_01.webp",
            client_name="Kabarole Zero-Grazing Farmers",
        )

        attach_media(
            db,
            p5,
            [
                "/images/projects/pasture-establishment_01.webp",
                "/images/projects/pasture-establishment_02.webp",
            ],
        )

        # ---------------------------------------------------------
        # 6️⃣ LIVESTOCK HOUSING CONSTRUCTION (NON-FEATURED)
        # ---------------------------------------------------------
        construction_service = find_service(db, "animal-production-consultancy")

        p6 = upsert_project(
            db,
            slug="farm-construction-lyantonde",
            name="Livestock Housing Construction — Lyantonde Ranch",
            description=(
                "Modern livestock sheds and manure channels integrated with a biogas system "
                "for efficient waste handling."
            ),
            short_description="Modern sheds & manure channels integrated with biogas.",
            location="Lyantonde, Uganda",
            status=ProjectStatus.ONGOING,
            is_featured=False,
            service_id=construction_service.id,
            cover_image_url="/images/projects/farm-construction_02.webp",
            client_name="Lyantonde Ranch",
        )

        attach_media(
            db,
            p6,
            [
                "/images/projects/farm-construction_02.webp",
                "/images/projects/farm-construction_03.webp",
            ],
        )

        db.commit()
        print("\n✅ Projects seeded successfully.\n")

    finally:
        db.close()


if __name__ == "__main__":
    main()

