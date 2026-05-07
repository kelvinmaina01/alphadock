# Scientific Core Phase

## Objective

Replace the mocked frontend flows with the first real AlphaDock vertical slice:

SMILES input plus target input to real docking job to live progress to persisted results.

This phase is intentionally Vina-first. It does not attempt to land the full future platform.

## Scope

### In scope

- auth foundation sufficient for user-scoped data
- SMILES validation and molecule persistence
- PDB ID and UniProt import
- protein preparation baseline
- pocket detection baseline
- job creation and persistence
- Redis and Celery orchestration
- Vina-only first real docking path
- live progress events to the web app
- persisted results hydration in dashboard, docking lab, and results views

### Out of scope

- GNINA
- DiffDock
- batch screening
- report generation beyond stub contracts
- institution features
- billing
- advanced agent autonomy

## Backend subsystem work

### API

Implement the first real routers for:

- molecules
- proteins
- jobs
- minimal auth/session support

The API should validate requests, persist records, enqueue work, and expose job and result retrieval for the frontend.

### Database

Create the initial schema for:

- users
- molecules
- proteins
- docking_jobs
- docking_results
- agent_sessions as a minimal placeholder if needed by the UI shell

### Workers

Implement the first real docking worker pipeline:

1. load job inputs
2. fetch or resolve protein artifact
3. prepare protein baseline
4. generate ligand conformer and PDBQT
5. run P2Rank baseline
6. run Vina
7. parse scores and poses
8. run interaction extraction baseline
9. persist results and publish completion

### Realtime

Publish job progress events through Redis and surface them through the API WebSocket layer using the event family frozen in `SYSTEM_CONTRACTS.md`.

## Frontend replacement order

1. Input page
   replace molecule validation and protein fetch mocks first
2. Docking lab
   replace mocked job startup, progress, energy bars, and pipeline log second
3. Results page
   replace mocked result hydration third
4. Dashboard
   replace recent jobs and quick-launch integrations last

This order keeps the most visible scientific path coherent as real services come online.

## Acceptance criteria

- a real user can validate a molecule and save it
- a real user can fetch a protein by PDB ID or UniProt and view preparation metadata
- a real job can be created and transitions through `pending`, `running`, and `done` or `failed`
- the docking lab receives live progress updates
- the results page renders persisted scores, poses, and interaction data
- failures for invalid molecules, invalid structures, upstream fetch errors, and worker compute errors are visible and actionable

## Scientific guardrails

- do not claim production scientific confidence until protein prep, pocketing, and scoring baselines are benchmarked
- expose uncertainty honestly in UI copy and result interpretation
- keep Vina-first before adding GPU-backed engines or broader screening surfaces
