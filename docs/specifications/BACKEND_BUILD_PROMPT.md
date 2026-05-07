# ALPHADOCK — MASTER BACKEND BUILD PROMPT

Complete specification for building the AlphaDock FastAPI backend from scratch. This document is the strict backend implementation contract for the project.

## WHAT YOU ARE BUILDING

The backend for AlphaDock — an AI-native molecular docking platform.

This backend does five things:

1. **Serves a REST API** (FastAPI) for the React frontend
2. **Orchestrates docking jobs** (Celery workers running AutoDock Vina / GNINA / DiffDock)
3. **Powers the AI agent** (Claude API with tool use — the agent controls the platform)
4. **Integrates 12+ external scientific APIs** (PubChem, ChEMBL, AlphaFold, ADMETlab, etc.)
5. **Streams real-time updates** (WebSocket + Redis pub/sub — energy landscape builds live)

## TECH STACK — NON-NEGOTIABLE

```text
Language:         Python 3.12
Framework:        FastAPI 0.115+
ASGI server:      Uvicorn (prod: Gunicorn + Uvicorn workers)
ORM:              SQLAlchemy 2.0 async (asyncpg driver)
Migrations:       Alembic
Task queue:       Celery 5.4+ with Redis broker
Cache / Pub-Sub:  Redis 7 (aioredis)
Database:         PostgreSQL 16 (+ RDKit cartridge)
File storage:     S3-compatible (boto3) — MinIO for local dev
Auth:             Supabase Auth (JWT verification) + custom JWT for API keys
AI:               Anthropic Python SDK (claude-sonnet-4-6, tool use)
Cheminformatics:  RDKit (rdkit-pypi)
Docking engines:  AutoDock Vina (pip install vina), GNINA (binary), DiffDock (torch)
Protein prep:     pdbfixer, propKa, OpenMM
Interaction:      PLIP (protein-ligand interaction profiler)
Ligand prep:      Meeko (PDBQT conversion)
Pocket detection: P2Rank (Java JAR, subprocess)
PDF generation:   WeasyPrint
HTTP client:      httpx (async)
Validation:       Pydantic v2
Settings:         pydantic-settings
Logging:          structlog
Error tracking:   Sentry SDK
Testing:          pytest + pytest-asyncio + httpx
Package manager:  uv
```

## REPOSITORY STRUCTURE

```text
apps/api/
├── app/
│   ├── main.py                    ← FastAPI app factory
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              ← All settings (pydantic-settings)
│   │   ├── database.py            ← SQLAlchemy async engine + session
│   │   ├── redis.py               ← Redis pool (aioredis)
│   │   ├── security.py            ← JWT encode/decode + bcrypt
│   │   ├── storage.py             ← S3/MinIO client (boto3)
│   │   └── deps.py                ← FastAPI dependency injections
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                ← /api/v1/auth/*
│   │   ├── molecules.py           ← /api/v1/molecules/*
│   │   ├── proteins.py            ← /api/v1/proteins/*
│   │   ├── jobs.py                ← /api/v1/jobs/*
│   │   ├── batch.py               ← /api/v1/batch/*
│   │   ├── agent.py               ← /api/v1/agent/*
│   │   ├── reports.py             ← /api/v1/reports/*
│   │   └── ws.py                  ← /ws/* WebSocket endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                ← Base model with uuid + timestamps
│   │   ├── user.py
│   │   ├── molecule.py
│   │   ├── protein.py
│   │   ├── docking_job.py
│   │   ├── docking_result.py
│   │   ├── agent_session.py
│   │   ├── batch_job.py
│   │   └── report.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── molecule.py
│   │   ├── protein.py
│   │   ├── job.py
│   │   ├── batch.py
│   │   ├── agent.py
│   │   └── report.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── molecule_service.py    ← RDKit ops, validation, DB save
│   │   ├── protein_service.py     ← PDB fetch, AF fetch, prep trigger
│   │   ├── docking_service.py     ← Job creation, engine selection
│   │   ├── admet_service.py       ← ADMETlab 3.0 API + cache
│   │   ├── agent_service.py       ← Claude API, tool registry, executor
│   │   └── report_service.py      ← Claude report + WeasyPrint PDF
│   └── tasks/
│       ├── __init__.py
│       ├── dock_molecule.py       ← Main docking Celery task
│       ├── prepare_protein.py     ← Protein preparation Celery task
│       ├── batch_screen.py        ← Batch screening Celery task
│       └── generate_report.py     ← PDF generation Celery task
├── alembic/
│   ├── env.py
│   └── versions/
│       ├── 001_initial_schema.py
│       ├── 002_rls_policies.py
│       └── 003_rdkit_extension.py
├── tests/
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_molecule_service.py
│   │   ├── test_docking_service.py
│   │   └── test_agent_service.py
│   └── integration/
│       ├── test_auth.py
│       ├── test_jobs.py
│       └── test_websocket.py
├── Dockerfile
├── Dockerfile.worker
├── pyproject.toml
└── alembic.ini

workers/docking/
├── celeryconfig.py
├── worker.py
├── tasks/
│   ├── dock_vina.py
│   ├── dock_gnina.py
│   ├── dock_diffdock.py
│   ├── prepare_protein.py
│   └── batch_screen.py
└── lib/
    ├── rdkit_utils.py
    ├── meeko_utils.py
    ├── plip_utils.py
    └── admet_client.py
```

## PART 1 — PROJECT SETUP

### `pyproject.toml`

```toml
[project]
name = "alphadock-api"
version = "0.1.0"
requires-python = ">=3.12"

dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "gunicorn>=23.0.0",
    "sqlalchemy[asyncio]>=2.0.0",
    "alembic>=1.14.0",
    "asyncpg>=0.30.0",
    "psycopg2-binary>=2.9.0",
    "redis>=5.2.0",
    "celery[redis]>=5.4.0",
    "flower>=2.0.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.6.0",
    "python-multipart>=0.0.12",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "httpx>=0.28.0",
    "boto3>=1.35.0",
    "anthropic>=0.40.0",
    "rdkit-pypi>=2024.9.0",
    "vina>=1.2.5",
    "meeko>=0.5.0",
    "plip>=2.3.0",
    "pdbfixer>=1.10.0",
    "propka>=3.5.0",
    "openmm>=8.1.0",
    "weasyprint>=62.0",
    "jinja2>=3.1.0",
    "structlog>=24.0.0",
    "sentry-sdk[fastapi]>=2.0.0",
    "python-dotenv>=1.0.0",
    "aiofiles>=24.0.0",
    "pillow>=11.0.0",
]

[project.optional-dependencies]
test = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "httpx>=0.28.0",
    "factory-boy>=3.3.0",
]
dev = [
    "ruff>=0.8.0",
    "mypy>=1.13.0",
]
```

## PART 2 — CORE CONFIGURATION

Core modules must be implemented under `apps/api/app/core/`:

- `config.py`: pydantic-settings settings object containing environment, database, Redis, auth, AI, storage, docking, external API, cache TTL, feature flag, CORS, and monitoring settings.
- `database.py`: SQLAlchemy async engine, session factory, declarative base, and `get_db` dependency with commit/rollback handling.
- `redis.py`: async Redis pool plus `cache_get`, `cache_set`, `cache_delete`, and `publish`.
- `security.py`: password hashing, JWT access/refresh token creation, and token decoding.
- `storage.py`: S3/MinIO upload, download, byte upload, presigned URL, and existence helpers.
- `deps.py`: FastAPI auth dependencies for current user and current admin.

Settings names, defaults, and behavior must follow the source prompt exactly, including:

- `DATABASE_URL`, `DATABASE_POOL_SIZE`, `DATABASE_MAX_OVERFLOW`, `DATABASE_POOL_TIMEOUT`
- `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
- `JWT_SECRET_KEY`, `JWT_ALGORITHM`, token expiry values, and Supabase settings
- `ANTHROPIC_API_KEY`, `CLAUDE_MODEL = "claude-sonnet-4-6"`, agent iteration/token limits
- S3/MinIO settings
- Vina/GNINA/P2Rank/Java paths and docking defaults
- ADMETlab, PubChem, ChEMBL, AlphaFold, and RCSB base URLs
- Cache TTLs and feature flags
- `CORS_ORIGINS` and `SENTRY_DSN`

## PART 3 — DATABASE MODELS

Implement SQLAlchemy 2.0 async-compatible models under `apps/api/app/models/`:

- `base.py`: `TimestampMixin`, `UUIDMixin`, and shared declarative base usage.
- `user.py`: users with email, hashed password, profile fields, role enum, API key hash, JSON settings, subscription tier, Stripe customer id, and relationships to molecules, proteins, docking jobs, agent sessions, and batch jobs.
- `molecule.py`: molecule ownership, SMILES, canonical SMILES, InChI, descriptors, PAINS flag, source enum, SDF path, and relationship to docking jobs.
- `protein.py`: optional owner, PDB/UniProt ids, metadata, source enum, prepared/raw paths, pockets, quality report, AlphaFold pLDDT, preparation status, and relationship to docking jobs.
- `docking_job.py`: user/molecule/protein refs, engine enum, docking parameters, pocket data, status enum, Celery task id, timestamps, error message, and relationships.
- `docking_result.py`: job ref, pose rank, Vina/GNINA scores, RMSD, estimated Kd, pose path, interactions, ADMET, and job relationship.
- `agent_session.py`: user ref, screen context, optional job ref, Claude messages, tool call audit log, and last message timestamp.
- `batch_job.py` and `report.py`: required by repository structure and endpoint surface; keep them aligned with batch/report routers and migrations.

## PART 4 — PYDANTIC SCHEMAS

Implement schemas under `apps/api/app/schemas/`, including:

- `job.py`: `CreateJobRequest`, `JobResponse`, `PoseResult`, `JobResultsResponse`.
- `agent.py`: `AgentMessageRequest`, `AgentMessageResponse`.
- `auth.py`, `molecule.py`, `protein.py`, `batch.py`, and `report.py` for the corresponding routers.

Use Pydantic v2, `model_config = {"from_attributes": True}` for ORM response schemas, UUID types for ids, and literal enums for bounded request values.

## PART 5 — MAIN APP FACTORY

`apps/api/app/main.py` must expose:

- `create_app() -> FastAPI`
- `app = create_app()`
- Sentry initialization when `SENTRY_DSN` is present
- CORS middleware using `settings.CORS_ORIGINS`
- Lifespan logging startup/shutdown and disposing the DB engine
- Vina presence check during startup
- Routers mounted under `/api/v1`
- WebSocket router mounted without API prefix
- `/health` endpoint returning `{"status": "ok", "version": settings.VERSION}`

## PART 6 — ROUTERS

Implement the complete API surface:

- `auth.py`: `/register`, `/login`, `/refresh`, `/me` GET, `/me` PUT.
- `molecules.py`: list molecules, validate SMILES, resolve from name, resolve from PubChem CID, resolve from ChEMBL, ADMET prediction, SDF upload, 2D image rendering.
- `proteins.py`: fetch/upload/list/prepare protein structures and expose preparation status.
- `jobs.py`: create/list/get/cancel/retry docking jobs, get results with presigned pose URLs, run resistance panel.
- `batch.py`: create/list/get/cancel batch screening workflows.
- `agent.py`: create/reuse agent sessions and send Claude tool-use messages.
- `reports.py`: generate and retrieve AI/PDF reports.
- `ws.py`: authenticated WebSocket endpoints for `/ws/jobs/{job_id}`, `/ws/batch/{batch_id}`, and `/ws/agent/{session_id}` using Redis pub/sub.

All user-owned routes must depend on `get_current_user`. Docking and long-running work must enqueue Celery tasks, never run synchronously inside FastAPI handlers.

## PART 7 — SERVICES

Implement services under `apps/api/app/services/`:

- `molecule_service.py`: RDKit validation, descriptor computation, Lipinski, PAINS, InChI/InChIKey, 2D PNG rendering, SDF parsing, PubChem lookup, ChEMBL lookup, Redis caching.
- `protein_service.py`: PDB fetch, AlphaFold fetch, upload handling, protein preparation task trigger, pocket metadata handling.
- `docking_service.py`: job creation, ownership checks, pocket selection, engine selection, Celery enqueue, retry enqueue.
- `admet_service.py`: ADMETlab 3.0 request, canonical SMILES hashing, Redis cache check before every external call, standardized output fields.
- `agent_service.py`: Claude API client, screen-specific tool registry, system prompt, iterative tool-use execution, Redis events, session persistence, frontend action forwarding, score explanation, ChEMBL/PDB/AlphaFold helper calls, analogue suggestions.
- `report_service.py`: Claude report generation plus WeasyPrint PDF creation and S3 storage.

## PART 8 — AI AGENT SERVICE

The agent must be tool-first and screen-aware. Required screen contexts:

- `input`: validate SMILES, load molecule, search PubChem, search ChEMBL, fetch PDB, fetch AlphaFold, run ADMET, suggest analogues.
- `draw`: add atom, add bond, add ring, add substituent, clear canvas, undo, export SMILES.
- `dock`: start docking, stop docking, set view mode, toggle water, select pose, explain score, run resistance panel.
- `results`: explain score, interpret interactions, generate report, suggest analogues.
- `report`: generate report, explain score, suggest analogues.

Agent constraints:

- Always confirm before destructive actions.
- Never fabricate docking scores.
- Acknowledge Vina uncertainty of about ±1.4 kcal/mol.
- Lead with action, then brief explanation.
- Keep ordinary responses to two sentences unless asked for detail.
- Use plain English.
- Use tools decisively instead of describing manual steps.

## PART 9 — CELERY WORKERS

Implement worker configuration and tasks under `workers/docking/`:

- `celeryconfig.py`: Redis broker/result backend, JSON serializers, queues `cpu_docking`, `gpu_docking`, `batch`, `light`, task routes, UTC, concurrency, prefetch, time limits, late ack, worker recycle.
- `worker.py`: Celery app loading config and task modules.
- `tasks/dock_vina.py`: full Vina docking pipeline.
- `tasks/dock_gnina.py`: GNINA GPU docking task.
- `tasks/dock_diffdock.py`: DiffDock GPU docking task gated by feature flag.
- `tasks/prepare_protein.py`: pdbfixer/OpenMM/propKa/P2Rank pipeline.
- `tasks/batch_screen.py`: batch docking orchestration.
- `lib/rdkit_utils.py`, `meeko_utils.py`, `plip_utils.py`, `admet_client.py`: reusable worker-side scientific helpers.

The Vina task pipeline must:

1. Read job config from DB.
2. Download or prepare protein.
3. Convert protein to PDBQT.
4. Prepare ligand via RDKit + Meeko.
5. Run Vina.
6. Publish pose evaluation updates.
7. Run PLIP interaction detection.
8. Run ADMET prediction after checking Redis cache.
9. Upload pose files to S3/MinIO.
10. Save `DockingResult` records.
11. Mark job `done` or `failed`.
12. Publish completion/failure events.

## PART 10 — ALEMBIC MIGRATIONS

Create migrations:

- `001_initial_schema.py`: users, molecules, proteins, docking_jobs, docking_results, agent_sessions, indexes.
- `002_rls_policies.py`: enable and force RLS on user-data tables; add isolation policies for molecules, docking jobs, docking results via jobs, agent sessions, and protein visibility.
- `003_rdkit_extension.py`: enable RDKit PostgreSQL cartridge, add `mol` column, create GiST index, and trigger to sync canonical SMILES to RDKit mol.

Important correction to preserve during implementation: if `batch_jobs` is included in RLS migration 002, the table must exist before the migration runs, or the migration must create/handle it in sequence.

## PART 11 — DOCKERFILES

Implement:

- `apps/api/Dockerfile`: Python 3.12 slim, system deps for WeasyPrint/Java, uv, install project, copy app and Alembic, run Gunicorn with Uvicorn workers.
- `apps/api/Dockerfile.worker`: Python 3.12 slim, Java/wget, uv, project install, Vina binary download, P2Rank download, copy app/workers, run Celery worker on `cpu_docking,light`.

## PART 12 — TESTING

Testing stack:

- `pytest`
- `pytest-asyncio`
- `pytest-cov`
- `httpx`
- `factory-boy`

Required tests:

- `tests/conftest.py`: async test engine/session, dependency override, `AsyncClient` with ASGI transport, authenticated client fixture.
- Unit tests for molecule, docking, and agent services.
- Integration tests for auth, jobs, WebSocket.
- SMILES validation valid/invalid cases.
- Job create endpoint behavior.
- Cross-user isolation behavior.

## PART 13 — DOCKER COMPOSE

Local development `docker-compose.yml` must include:

- `web`: frontend on port 3000.
- `api`: FastAPI on port 8000 with hot reload and app environment.
- `worker-cpu`: Celery worker for `cpu_docking,light`.
- `db`: PostgreSQL 16 with RDKit cartridge requirement.
- `redis`: Redis 7.
- `minio`: S3-compatible local storage on ports 9000/9001.
- `flower`: Celery monitor on port 5555.

## PART 14 — FIRST RUN CHECKLIST

```bash
git clone https://github.com/alphadock/alphadock.git && cd alphadock
cp .env.example .env
docker-compose up --build -d
docker-compose exec api alembic upgrade head
docker-compose exec worker-cpu vina --version
docker-compose exec worker-cpu java -jar /opt/p2rank_2.4.2/p2rank.jar --version
docker-compose exec api python scripts/seed.py
curl http://localhost:8000/health
open http://localhost:8000/docs
open http://localhost:5555
docker-compose exec api pytest tests/ -v --cov=app
```

Expected health response:

```json
{"status": "ok", "version": "0.1.0"}
```

## WHAT NOT TO DO

- **Never expose `ANTHROPIC_API_KEY` in API responses, logs, or errors.** Filter it from all exception outputs.
- **Never put AI calls in request handlers directly.** All Claude calls go through `agent_service.py`. Keep the pattern consistent.
- **Never skip RLS.** Every new table with user data needs an RLS policy in migration 002 or a new migration.
- **Never run docking synchronously in FastAPI handlers.** Always enqueue to Celery. A synchronous docking call will block the entire worker process for 30+ seconds.
- **Never skip Meeko preparation.** Raw SMILES fed to Vina without PDBQT preparation gives meaningless results.
- **Never cache Claude API responses.** Every agent response is context-specific. Caching would return stale tool calls for different UI states.
- **Never call ADMETlab without checking the Redis cache first.** The API has rate limits and you pay per call at scale.

---

AlphaDock Backend Build Prompt — v1.0 — April 2026.

This Markdown document is intentionally implementation-directive rather than aspirational. Backend work should follow it unless a later specification supersedes it explicitly.
