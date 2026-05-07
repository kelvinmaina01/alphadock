# AlphaDock Master Roadmap

## Purpose

This roadmap defines the build order for AlphaDock as a web-first scientific product. It assumes:

- browser delivery is the primary distribution model
- the frontend is built first as a high-fidelity prototype
- backend implementation follows frozen contracts rather than inventing data shapes ad hoc

## Product stance

- Primary platform: web
- Desktop: out of core scope; reconsider only for later enterprise or on-prem distribution
- Frontend strategy: hybrid
  landing, dashboard quick-launch, input, draw, docking lab, and results get the highest fidelity first
  report, batch, settings, admin, and billing can start functional-first

## Phase map

### Phase A: Web product prototype

Build the full frontend shell with realistic mocked data and flows.

Deliverables:

- route-complete React app
- global design system from `MASTER_PROMPT.md`
- agent panel on every major screen
- mocked job lifecycle, pose updates, batch progress, and report data
- typed mocks that mirror future backend contracts

Exit gate:

- a user can experience AlphaDock end to end without live backend dependencies
- the prototype is credible for demos, design review, and engineering alignment

### Phase B: System contracts and backbone

Freeze the interfaces the frontend depends on.

Deliverables:

- shared domain types
- REST route contract definitions
- WebSocket event contracts
- job lifecycle and error model
- storage key conventions for proteins, ligands, poses, libraries, and reports

Exit gate:

- frontend mocks map directly to real interface definitions
- backend and worker work can proceed without guessing UI expectations

### Phase C: Scientific core replacement

Replace mocked flows with the first real docking vertical slice.

Deliverables:

- auth foundation
- molecule validation and persistence
- protein ingestion from PDB and UniProt
- preparation baseline and pocket detection baseline
- job creation, queue orchestration, progress streaming, and result persistence
- Vina-only first real compute path

Exit gate:

- one authenticated user can run a real job from molecule and target input to persisted results with live updates

### Phase D: Advanced science and agent operations

Extend the platform after the scientific core is stable.

Deliverables:

- GNINA and DiffDock routing
- deeper ADMET and protein quality reporting
- batch screening
- resistance and selectivity workflows
- report generation
- broader agent tool execution
- exports and richer analysis views

Exit gate:

- the platform matches the major researcher-facing capabilities promised in the feature spec

### Phase E: Production hardening and commercial platform

Operationalize the system for serious deployment.

Deliverables:

- GKE deployment path
- Cloud SQL, Redis, S3, and secrets wiring
- CI/CD, observability, error tracking, alerts, and staging/prod rollout
- performance and load testing
- security hardening and audit trail coverage
- billing, institution features, admin workflows, and licensing compliance

Exit gate:

- staging and production rollout are repeatable, monitored, and supportable
- commercial access rules are enforced in code

## Dependency order

1. Frontend shell and interaction model
2. Shared types and contracts
3. Scientific core backend and worker path
4. Advanced scientific services and AI tool execution
5. Production and commercial hardening

## Scope boundaries

### In scope early

- web UX
- mocked-first frontend
- typed contracts
- Vina-first scientific core
- realtime progress model
- results and reporting surfaces

### Deferred until later

- desktop packaging
- institution accounts
- Stripe and subscription enforcement
- on-prem deployment variants
- heavy enterprise admin tooling

## Key risks

- a polished mock frontend can create false confidence if contracts are not frozen immediately after
- scientific credibility depends on the correctness of preparation, docking, and interpretation pipelines
- third-party licensing for ADMETlab, DrugBank, ZINC use cases, and related services must be reviewed before commercial release
- GPU-backed engines and large-scale batch screening can distort infrastructure choices if introduced before the Vina-first path is stable

## Source documents

- `AlphaDock_Architecture_v2.docx`
- `AlphaDock_Feature_Spec.docx`
- API and integration guide captured in `MASTER_PROMPT.md` references and contract docs
