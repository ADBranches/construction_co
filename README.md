# Construction Company Web Platform

Full-stack web platform for a construction company in Uganda.

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** FastAPI (Python) + PostgreSQL
- **Infra:** Docker, docker-compose, Nginx (reverse proxy)
- **Target:** Same behavior locally (Kali) and in production, with all config via environment variables.

---

## Project Structure

```bash
.
├── README.md
├── .gitignore
└── construction-app/
    ├── backend/        # FastAPI app
    ├── frontend/       # React + Vite + Tailwind app
    ├── infra/          # Docker, Nginx, deployment configs
    ├── docs/           # Architecture, API docs, admin manual
    └── scripts/        # Helper scripts (dev, deploy, backup)

