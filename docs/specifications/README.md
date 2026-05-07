# AlphaDock Specification Pack

This folder is the authoritative execution pack for AlphaDock.

The original source material still matters:

- `AlphaDock_Architecture_v2.docx`
- `AlphaDock_Feature_Spec.docx`
- the API and integration guide shared in chat

This folder translates that material into repo-native Markdown that engineers can execute against without guessing.

## Core documents

- [MASTER_ROADMAP.md](./MASTER_ROADMAP.md)
  Top-level phase map, dependencies, scope boundaries, and delivery gates.
- [MASTER_PROMPT.md](./MASTER_PROMPT.md)
  Canonical frontend design and implementation prompt for the web product.
- [BACKEND_BUILD_PROMPT.md](./BACKEND_BUILD_PROMPT.md)
  Canonical backend build prompt for the FastAPI, Celery, docking, AI agent, and scientific integration stack.
- [FRONTEND_PHASE_PLAN.md](./FRONTEND_PHASE_PLAN.md)
  Decision-complete frontend build sequence for the mocked-first prototype.
- [SYSTEM_CONTRACTS.md](./SYSTEM_CONTRACTS.md)
  Shared contracts across web, API, workers, storage, and realtime.
- [SCIENTIFIC_CORE_PHASE.md](./SCIENTIFIC_CORE_PHASE.md)
  First backend replacement phase for the real docking path.
- [DELIVERY_CHECKLIST.md](./DELIVERY_CHECKLIST.md)
  Delivery gates for environment, quality, security, observability, and rollout.

## Working rules

1. The web app is the primary product.
2. The frontend prototype is not throwaway; it is the permanent shell the backend will replace mocks beneath.
3. Contracts must be frozen before backend implementation proceeds beyond scaffolding.
4. Scientific correctness, operational reliability, and licensing constraints outrank speed once real compute is introduced.

## Current build posture

The repository currently contains an early scaffold:

- `apps/web` has the route skeleton and placeholder screens.
- `apps/api` exposes only a minimal scaffold API.
- workers, services, and routers are mostly structural placeholders.

Use that scaffold as a starting point, not as the product definition.
