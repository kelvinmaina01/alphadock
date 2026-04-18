# Repository details (for contributors)

## Specification documents

Authoritative product and engineering specs should live under [`docs/specifications/`](specifications/README.md) (three documents: architecture, feature spec, repository/setup guide). Add your files there when ready.

## What this repo is building

AlphaDock is a **full product** around structure-based ligand design:

1. **Inputs:** SMILES, names (PubChem/ChEMBL/DrugBank), uploads (SDF/MOL2), drawing, custom PDB / AlphaFold structures, batch libraries.
2. **Core compute:** Protein prep, pocket definition, conformer generation, docking (Vina first; GNINA/DiffDock-class as optional engines), optional rescoring tiers later.
3. **Outputs:** Ranked poses, interaction annotations (e.g. PLIP-class), uncertainty messaging, ADMET flags, resistance/sensitivity panels, exportable reports.
4. **AI:** Claude (or compatible API) with **tools** that map to backend operations and safe UI actions — chat surfaces on landing, input, draw, lab, results, and report pages.

## Service boundaries

```
Browser (React)
    │  HTTPS / WSS
    ▼
FastAPI (apps/api) — auth, CRUD, signed uploads, job create/cancel, agent session
    │
    ├──► PostgreSQL — users, jobs, molecules, proteins, artifacts metadata
    ├──► Redis — Celery broker + job event channel
    └──► Object storage — PDB/SDF/pose outputs (S3-compatible)

Worker processes — docking runs, long prep, batch screens, external fetch
    └──► Same DB/Redis; publish events for WebSocket layer in API
```

## API surface (conceptual; implement incrementally)

**Auth:** register, login, refresh, logout, org/invite (later).

**Molecules:** validate SMILES, 2D depiction metadata, Lipinski-like descriptors, library CRUD.

**Proteins:** upload PDB, fetch PDB ID, fetch AlphaFold by UniProt, prep status.

**Jobs:** create docking job, get status, list poses, stream events (`job.log`, `job.pose`, `job.completed`).

**Batch:** create batch job from library, progress, top-K summary.

**Agent:** session per screen; POST message → model + tool loop → persisted transcript; tools are allow-listed server functions.

**Reports:** generate PDF/Markdown bundle from a completed job (async).

## Frontend routes (suggested)

| Route | Purpose |
|-------|---------|
| `/` | Landing + pitch + CTA |
| `/login`, `/signup` | Auth |
| `/app` | Authenticated shell (sidebar, agent panel slot) |
| `/app/input` | Molecule + target setup |
| `/app/draw` | Structure editor + agent canvas tools |
| `/app/lab/:jobId` | Docking lab: 3D viewport, live scores, logs |
| `/app/results/:jobId` | Pose table, interactions, exports |
| `/app/report/:jobId` | Narrative + next steps + download |
| `/app/batch/:batchId` | Batch progress and hit list |
| `/app/settings` | API keys (org), preferences |

## External systems (integration order)

1. **RCSB PDB** — structure by ID; ligand handling cautions documented in UI.
2. **AlphaFold DB (EBI)** — predicted structures when no PDB.
3. **PubChem PUG REST** — name/CID → SMILES.
4. **ChEMBL** — annotated bioactivities for search/suggestions.
5. **ZINC / in-house libraries** — batch screening sources (licensing per mirror).
6. **ADMET predictors** — start with one well-documented service; add second for disagreement signals later.

## Security principles

- Agents never get raw OS execution; tools are **typed RPCs** with validation.
- All uploads scanned for size/type; malware scanning in production.
- Row-level security: jobs and molecules scoped to user/org.
- Rate limits on agent and expensive compute endpoints.

## Testing layers

- API: pytest + httpx async client
- Web: Vitest + React Testing Library; Playwright for critical flows later
- Workers: golden-file tests on tiny PDB/ligand pairs

## Definition of Done (first milestone)

- One end-to-end path: PDB ID + SMILES → job → stored best score + pose artifact path → simple results page
- WebSocket or SSE: streaming log lines from worker
- Agent panel: mock or real “explain this score” with no destructive tools
