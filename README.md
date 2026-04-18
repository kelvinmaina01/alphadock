# AlphaDock

AI-native molecular docking workstation: interpretable structure-based design for scientists who should not need a command line to run serious virtual screening.

## Vision (one paragraph)

AlphaDock combines open docking engines (Vina, GNINA, later DiffDock-class tools), cheminformatics (RDKit), structure sources (PDB, AlphaFold DB), and an **agentic AI layer** that explains uncertainty, routes jobs, and drives the UI (draw, batch, resistance panels, reports). The product goal is not “another Vina GUI” but **multiparameter context** (pose quality, affinity estimates, ADMET flags, selectivity panels) with **live feedback** and **tool-using** assistants on every surface.

## Monorepo layout

Authoritative tree: **AlphaDock_Repo_Guide.docx** (also extracted to `_docx_extract/*.txt` locally; folder is gitignored).

| Path | Role |
|------|------|
| `apps/web` | React 18 + Vite + TypeScript: `src/app/*` routes, `components/*`, hooks, stores, Mol* / RDKit integration (per guide §1.2) |
| `apps/api` | FastAPI 3.12: `app/routers`, `services`, `tasks`, WebSockets (per guide §1.3) |
| `packages/ui` | Shared React component library |
| `packages/types` | Shared TypeScript types |
| `packages/config` | Shared ESLint / TS / Prettier configs |
| `workers/docking`, `workers/admet`, `workers/report` | Celery workers (per guide §1.1) |
| `infra/terraform`, `infra/k8s`, `infra/docker` | IaC and container definitions |
| `scripts/` | `seed.py`, `download_libraries.py`, `validate_install.sh` |
| `docs/` | ADRs, environment notes, specifications index |
| Root `.docx` specs | **AlphaDock_Architecture_v2**, **AlphaDock_Feature_Spec**, **AlphaDock_Repo_Guide** — product source of truth |

## Stack (initial)

- **Frontend:** React 18+, TypeScript, Vite, TanStack Query, Zustand (or similar), Mol* (or NGL) for structure, WebSocket client for job streams
- **Backend:** FastAPI, Pydantic v2, SQLAlchemy 2 + Alembic, Redis, PostgreSQL
- **Compute:** RDKit, AutoDock Vina / Meeko prep; optional GNINA in GPU worker later
- **AI:** Anthropic Messages API with **tool use** mapping to server actions (never raw shell from the model)

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker (optional, for Postgres/Redis via Compose)

## Quick start (local)

### API (PowerShell on Windows)

```powershell
cd apps\api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Web

From the repository root (after `npm install` for workspaces):

```powershell
npm run dev
```

Or only the UI:

```powershell
cd apps\web
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The UI proxies `/api` and `/health` to `http://localhost:8000` in dev. For `npm run dev` at the root, ensure the API venv has `uvicorn` available on `PATH` or use separate terminals for API and web as above.

## Environment variables

See `docs/ENVIRONMENT.md` for the full list. Minimum for early development:

| Variable | Service | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | API | PostgreSQL async URL |
| `REDIS_URL` | API / workers | Queue + pub/sub for job events |
| `ANTHROPIC_API_KEY` | API | Agent + report generation (do not commit) |

## Git workflow (suggested)

- `main`: release-ready
- `develop`: integration (optional)
- Feature branches: `feat/…`, `fix/…`, `chore/…`
- PRs with description, screenshots for UI, and migration notes if schema changes

## License

TBD — choose before public release (docking engines and datasets have their own terms).
