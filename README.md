<div align="center">

```
 █████╗ ██╗     ██████╗ ██╗  ██╗ █████╗ ██████╗  ██████╗  ██████╗██╗  ██╗
██╔══██╗██║     ██╔══██╗██║  ██║██╔══██╗██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝
███████║██║     ██████╔╝███████║███████║██║  ██║██║   ██║██║     █████╔╝ 
██╔══██║██║     ██╔═══╝ ██╔══██║██╔══██║██║  ██║██║   ██║██║     ██╔═██╗ 
██║  ██║███████╗██║     ██║  ██║██║  ██║██████╔╝╚██████╔╝╚██████╗██║  ██╗
╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝
```

**AI-Native Molecular Docking Platform**

*Drug discovery that belongs to everyone — not just Big Pharma*

---

[![License](https://img.shields.io/badge/license-MIT-0EA5E9?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-1D4ED8?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18.3-0EA5E9?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-059669?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4--6-7C3AED?style=flat-square)](https://anthropic.com)
[![AutoDock Vina](https://img.shields.io/badge/AutoDock_Vina-1.2.5-D97706?style=flat-square)](https://github.com/ccsb-scripps/AutoDock-Vina)
[![GNINA](https://img.shields.io/badge/GNINA-1.0.3-DC2626?style=flat-square)](https://github.com/gnina/gnina)
[![Mol*](https://img.shields.io/badge/Mol*-4.x-334155?style=flat-square)](https://molstar.org)
[![Build](https://img.shields.io/badge/build-passing-059669?style=flat-square&logo=github-actions&logoColor=white)](.github/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-84%25-059669?style=flat-square)](https://codecov.io)
[![Docker](https://img.shields.io/badge/Docker-ready-0EA5E9?style=flat-square&logo=docker&logoColor=white)](docker-compose.yml)

<br/>

> **"A biology PhD student in Nairobi, a medicinal chemist in Lagos, a pharmacologist in Jakarta —  
> all get the same tools as a Roche scientist in Basel."**

<br/>

[**Live Demo**](https://alphadock.io) · [**Documentation**](docs/) · [**API Reference**](https://alphadock.io/docs) · [**Research Paper**](#) · [**Discord**](#)

</div>

---

## ◈ The Problem We're Solving

Drug discovery takes **$2.8 billion** and **17 years** per approved drug. The critical bottleneck — molecular docking (finding which compounds bind to a disease target) — requires:

| Barrier | Reality |
|---------|---------|
| 💰 Software cost | $50,000+/year for Schrödinger Suite |
| 🎓 Expertise required | PhD in computational chemistry + Linux CLI proficiency |
| ⏱️ Setup time | Weeks of configuration before running a single job |
| 🌍 Access | Only scientists at well-funded institutions |

**90% of the human proteome remains undrugged** — not because drugs can't be found, but because the tools to find them aren't accessible.

AlphaDock eliminates every one of these barriers.

---

## ◈ Ecosystem map: AlphaFold vs AlphaDock

Read this like a **Grafana-style dashboard row**: three **panels** with different **severities** — green for what **DeepMind’s AlphaFold family** largely unlocked at scale, amber for what **small-molecule workflows** still wrestle with, and blue for the **AlphaDock** product layer that sits **downstream** of structure prediction (complementary, not a replacement).

```mermaid
flowchart LR
  subgraph P1["Panel A — sequence → structure (DeepMind / AlphaFold family)"]
    direction TB
    SEQ([Amino-acid sequence])
    AF[AlphaFold-class prediction]
    SRC[(Public structure sources<br/>AlphaFold DB · PDB · …)]
    SEQ --> AF --> SRC
  end

  subgraph P2["Panel B — ligand → decision (still hard + toolchain-heavy)"]
    direction TB
    LIG([Small-molecule input])
    POS[Pose search · scoring · reranking]
    MULTI[Selectivity · resistance · ADMET<br/>batch screening · uncertainty]
    OUT[Design cycles + assays (ground truth)]
    LIG --> POS --> MULTI --> OUT
  end

  subgraph P3["Panel C — AlphaDock (workbench + agent)"]
    direction TB
    UI[Browser workstation · live jobs]
    AGT[Tool-backed copilot]
    RPT[Interpretation + reports]
    UI --> AGT --> RPT
  end

  SRC -->|receptor / pocket context| POS
  POS --> UI
  RPT -.->|annotated hypotheses| OUT
  MULTI -.->|human-in-the-loop| OUT

  style P1 fill:#0b1220,stroke:#22c55e,stroke-width:2px,color:#e5e7eb
  style P2 fill:#0b1220,stroke:#f59e0b,stroke-width:2px,color:#e5e7eb
  style P3 fill:#0b1220,stroke:#38bdf8,stroke-width:2px,color:#e5e7eb
  style SEQ fill:#052e16,stroke:#4ade80,color:#dcfce7
  style AF fill:#14532d,stroke:#22c55e,color:#ecfdf5
  style SRC fill:#14532d,stroke:#22c55e,color:#ecfdf5
  style LIG fill:#422006,stroke:#fb923c,color:#ffedd5
  style POS fill:#713f12,stroke:#fbbf24,color:#fffbeb
  style MULTI fill:#713f12,stroke:#fbbf24,color:#fffbeb
  style OUT fill:#422006,stroke:#fb923c,color:#ffedd5
  style UI fill:#172554,stroke:#60a5fa,color:#dbeafe
  style AGT fill:#312e81,stroke:#818cf8,color:#eef2ff
  style RPT fill:#164e63,stroke:#22d3ee,color:#ecfeff
```

<details>
<summary><strong>Monochrome ASCII</strong> (for terminals / exports where Mermaid is unavailable)</summary>

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    DeepMind-class models vs AlphaDock (same pipeline, different layer) │
└──────────────────────────────────────────────────────────────────────────────────────────┘

SEQUENCE ──► 3D PROTEIN STRUCTURE          SMALL MOLECULE ──► POSES / RANKS / DESIGN CYCLES
     │                         │                                      │
     │   LARGELY ADDRESSED     │                                      │   STILL WORKFLOW + SCIENCE
     │   at scale & speed      │                                      │   (needs tools + rigor)
     v                         v                                      v
┌─────────────┐         ┌─────────────┐                        ┌─────────────────────────────┐
│  DeepMind   │         │   Unlock    │                        │        AlphaDock            │
│  AlphaFold  │────────►│  Models for │                        │  Product layer on open      │
│  (family)   │         │  targets &  │                        │  engines + cheminformatics  │
└─────────────┘         │  hypotheses │                        │  + agentic assistance       │
                        └──────┬──────┘                        └──────────────┬──────────────┘
                               │                                              │
                               │  NOT automatically solved                    │  Aims to improve
                               v                                              v
                 ┌──────────────────────────────┐              ┌──────────────────────────────┐
                 │  Affinity / ranking certainty │              │  Docking lab UX (draw/batch)  │
                 │  Selectivity / resistance     │              │  Live progress + explanations │
                 │  ADMET / medchem decisions      │              │  Reports + guard-railed tools │
                 │  Experimental validation      │              │  No terminal required path    │
                 └──────────────────────────────┘              └──────────────────────────────┘

Ground truth loop:  assays / medchem  ◄────────────────────────────────────────────────────────
```

</details>

---

## ◈ What AlphaDock Does

```
Paste a SMILES string  →  Select a protein target  →  Watch your ligand dock in real time
      ↓                           ↓                              ↓
  RDKit validates          AlphaFold or PDB          Live 3D simulation
  Lipinski checks          P2Rank detects pocket     Energy landscape chart
  2D preview renders       Structure prepared        AI interprets results
                                                     PDF report generated
```

- **Live 3D molecular docking simulation** — watch every pose evaluated as it happens
- **AI agent with full platform access** — draws molecules, runs docking, explains results, generates reports via natural language
- **Zero setup** — paste SMILES + PDB ID, click Run. No terminal. No license. No PhD.
- **Integrated ADMET profiling** — pharmacokinetics alongside binding affinity in one view
- **Resistance mutation panel** — know if your compound will fail against T315I before you synthesise it
- **Batch virtual screening** — screen thousands of compounds overnight

---

## ◈ Table of Contents

- [Ecosystem map: AlphaFold vs AlphaDock](#-ecosystem-map-alphafold-vs-alphadock)
- [Architecture Overview](#-architecture-overview)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Data Flow Diagram](#-data-flow--request-lifecycle)
- [Database Schema](#-database-schema)
- [AI Agent Architecture](#-ai-agent-architecture)
- [Docking Pipeline](#-docking-compute-pipeline)
- [API Architecture](#-api-architecture)
- [Infrastructure & Kubernetes](#-infrastructure--kubernetes)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Tool & Integration Map](#-tool--integration-map)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Application Pages](#-application-pages)
- [Feature Reference](#-feature-reference)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)

---

## ◈ Architecture Overview

AlphaDock is a **microservices platform** with five primary service domains, a shared data layer, and an AI orchestration layer that operates across every service.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ALPHADOCK PLATFORM                                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        CLIENT TIER                                    │  │
│  │                                                                       │  │
│  │  React 18 + TypeScript + Vite                                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │ Landing  │ │  Input   │ │   Draw   │ │Dock Lab  │ │ Results  │  │  │
│  │  │  /       │ │  /input  │ │  /draw   │ │  /dock   │ │/results  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│  │       ┌─────────────────────────────────────────────────┐           │  │
│  │       │  Mol* 3D Viewer  │  RDKit.js WASM  │  WS Client │           │  │
│  │       └─────────────────────────────────────────────────┘           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                              │ HTTPS + WSS                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                       GATEWAY TIER                                    │  │
│  │         Nginx  (TLS termination · Rate limiting · WS upgrade)        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                              │                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    APPLICATION TIER                                   │  │
│  │                                                                       │  │
│  │  FastAPI (Python 3.12)  ·  Async  ·  Pydantic v2  ·  SQLAlchemy 2  │  │
│  │                                                                       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │  │
│  │  │Auth Service│ │  Molecule  │ │  Protein   │ │  Job / Batch   │   │  │
│  │  │ /auth/*    │ │  Service   │ │  Service   │ │    Service     │   │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │  │
│  │  ┌────────────────────────────────────────────────────────────┐     │  │
│  │  │            AI Agent Service  /agent/*                      │     │  │
│  │  │   Claude API (claude-sonnet-4-6)  ·  Tool Registry         │     │  │
│  │  └────────────────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│           │ Celery Tasks                    │ WebSocket Events              │
│  ┌─────────────────────────┐    ┌────────────────────────────────────┐     │
│  │    COMPUTE TIER          │    │         REALTIME TIER              │     │
│  │                          │    │                                    │     │
│  │  ┌──────────────────┐   │    │  Redis Pub/Sub ←→ WS Handlers      │     │
│  │  │  CPU Workers (4) │   │    │                                    │     │
│  │  │  AutoDock Vina   │   │    └────────────────────────────────────┘     │
│  │  │  Meeko · PLIP    │   │                                              │
│  │  │  P2Rank · RDKit  │   │                                              │
│  │  └──────────────────┘   │                                              │
│  │  ┌──────────────────┐   │                                              │
│  │  │  GPU Workers (4) │   │                                              │
│  │  │  GNINA · DiffDock│   │                                              │
│  │  └──────────────────┘   │                                              │
│  └─────────────────────────┘                                              │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         DATA TIER                                     │  │
│  │                                                                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐   │  │
│  │  │ PostgreSQL  │  │   Redis 7   │  │    S3 / MinIO             │   │  │
│  │  │    16       │  │             │  │                           │   │  │
│  │  │ + RDKit     │  │ • Job queue │  │ • Prepared PDB files      │   │  │
│  │  │ cartridge   │  │ • App cache │  │ • Docked pose PDBs        │   │  │
│  │  │ + RLS       │  │ • Pub/Sub   │  │ • Batch SDF libraries     │   │  │
│  │  └─────────────┘  └─────────────┘  │ • Generated PDF reports   │   │  │
│  │                                     └───────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      EXTERNAL SERVICES                               │  │
│  │                                                                       │  │
│  │  RCSB PDB  ·  AlphaFold EBI  ·  PubChem  ·  ChEMBL  ·  ZINC-22    │  │
│  │  DrugBank  ·  ADMETlab 3.0   ·  Anthropic Claude API                │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ◈ System Architecture Diagram

### Tier Breakdown

| Tier | Technology | Responsibility |
|------|------------|----------------|
| **Client** | React 18 + TypeScript + Vite | UI, Mol* 3D viewer, RDKit.js WASM, real-time WebSocket updates |
| **Gateway** | Nginx | TLS termination, rate limiting (100 req/min), WebSocket upgrade |
| **Application** | FastAPI (Python 3.12) | Business logic, auth, API routes, WS handlers |
| **AI Orchestration** | Claude API (claude-sonnet-4-6) | Agent decisions, tool execution, report generation |
| **Compute** | Celery + Vina / GNINA / DiffDock | Async docking on CPU/GPU pods |
| **Data** | PostgreSQL 16 + Redis 7 + S3 | Persistence, caching, file storage |
| **Infra** | Docker + Kubernetes (GKE) + Terraform | Containerisation, orchestration, IaC |
| **CI/CD** | GitHub Actions + ArgoCD | Automated test → build → deploy |
| **Monitoring** | Prometheus + Grafana + Sentry | Metrics, alerting, error tracking |

---

## ◈ Data Flow — Request Lifecycle

### Single Compound Docking — Full Journey

```
USER BROWSER
│
│  [1] Paste SMILES string
│       │
│       ├─→ RDKit.js WASM (browser, <50ms, zero network)
│       │    Validates SMILES · computes MW/logP/Lipinski · renders 2D SVG
│       │    ✓ Instant feedback — no API call
│       │
│  [2] Click "Run Docking"
│       │
│       └─→ POST /api/v1/jobs/ ──────────────────────────────────────────→ FASTAPI
│                                                                              │
│                                                              Pydantic validates
│                                                              JWT auth check
│                                                              RLS: molecule/protein
│                                                              owned by user?
│                                                              INSERT docking_jobs
│                                                              (status=pending)
│                                                              Celery enqueue:
│                                                              dock_molecule.delay()
│                                                              │
│                                                              └─→ Redis RPUSH
│                                                                  celery-cpu_docking
│
│  [3] WebSocket upgrade
│       │
│       └─→ GET /ws/jobs/{job_id} ─────────────────────────────────────→ FASTAPI WS
│                                                                              │
│                                                              Subscribe to Redis
│                                                              pub/sub channel
│                                                              "job:{job_id}"
│
CELERY WORKER (worker-cpu pod)
│
│  [4] Redis BLPOP → task deserialized
│       │
│       ├─→ Read job config from PostgreSQL
│       │
│       ├─→ S3 download: prepared protein PDB (or run preparation pipeline)
│       │    pdbfixer → propKa → OpenMM 10-step → P2Rank pockets
│       │
│       ├─→ Ligand preparation
│       │    RDKit: SMILES → 3D conformer (ETKDGv3)
│       │    Meeko: conformer → PDBQT with Gasteiger charges
│       │
│       ├─→ Engine selection
│       │    MW≤500, rot_bonds≤10, no warhead → AutoDock Vina ← default
│       │    Covalent warhead detected        → GNINA (covalent mode)
│       │    MW>600 or macrocycle             → DiffDock (GPU pod)
│       │
│       ├─→ Docking subprocess (Vina example)
│       │    vina.dock(receptor, ligand, box_centre, box_size, exhaustiveness=16)
│       │    │
│       │    └─→ stdout pipe: for each REMARK VINA RESULT line:
│       │         parse score (kcal/mol) + RMSD
│       │         compute Kd = exp(score / RT)  [R=0.001987, T=310.15K]
│       │         Redis PUBLISH "job:{id}" {pose_evaluated event}
│       │              │
│       │              └─→ FastAPI WS handler → browser
│       │                   ↓
│       │              Energy landscape bar added (real-time)
│       │              HUD counters update
│       │              Ligand animation advances toward pocket
│       │
│       ├─→ PLIP: detect all interactions in best pose
│       │    H-bonds · hydrophobic · pi-stacking · salt bridges · halogen bonds
│       │    Result: interactions JSONB
│       │
│       ├─→ ADMETlab 3.0 API (parallel, light queue)
│       │    88 endpoints: bioavailability · CYP · hERG · BBB · toxicity
│       │    Cached in Redis 24h by canonical SMILES hash
│       │
│       ├─→ S3 upload: 9 pose PDB files
│       │    jobs/{job_id}/pose_1.pdb ... pose_9.pdb
│       │
│       ├─→ PostgreSQL: INSERT 9 docking_results rows
│       │    scores · RMSD · interactions · ADMET per pose
│       │
│       └─→ UPDATE docking_jobs status=done
│            Redis PUBLISH "job:{id}" {job_done: {best_score: -9.8}}
│
USER BROWSER receives job_done
│
│  [5] Mol* loads best pose from S3 pre-signed URL
│       Ligand animation stops · settles in best pose
│       Sidebar populates: scores · bonds · ADMET
│       "View Results" button appears
│       "Generate AI Report" button appears
│
│  [6] Optional: POST /api/v1/agent/message "Generate a report"
│       │
│       ├─→ agent_service builds system prompt with full job context
│       ├─→ Claude API call (claude-sonnet-4-6, max_tokens=2500)
│       ├─→ Structured JSON report: mechanism · interactions · ADMET · next steps
│       ├─→ WeasyPrint: HTML template + JSON → PDF
│       ├─→ S3 upload: reports/{report_id}.pdf
│       └─→ Response: pre-signed download URL
```

---

## ◈ Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│        users        │
├─────────────────────┤
│ id (UUID PK)        │
│ email (UNIQUE)      │
│ full_name           │
│ institution         │◄──────────────────────────────────────────────┐
│ role (user/admin)   │                                                │
│ api_key_hash        │                                                │
│ settings (JSONB)    │                                                │
│ created_at          │                                                │
└─────────────────────┘                                                │
         │ 1                                                           │
         │                                                             │
    ┌────┴────────────────┐      ┌────────────────────────┐           │
    │      molecules      │      │       proteins         │           │
    ├─────────────────────┤      ├────────────────────────┤           │
  N │ id (UUID PK)        │      │ id (UUID PK)           │           │
    │ user_id (FK→users)  │      │ user_id (FK→users)     │           │
    │ smiles (NOT NULL)   │      │ pdb_id                 │           │
    │ inchi               │      │ uniprot_id             │           │
    │ name                │      │ name                   │           │
    │ mw (FLOAT)          │      │ resolution (FLOAT)     │           │
    │ logp (FLOAT)        │      │ source (ENUM)          │           │
    │ hbd (INT)           │      │ pdb_path (S3)          │           │
    │ hba (INT)           │      │ raw_path (S3)          │           │
    │ rot_bonds           │      │ pockets (JSONB)        │           │
    │ lipinski_pass       │      │ quality_report (JSONB) │           │
    │ pains_flag          │      │ af_plddt_path (S3)     │           │
    │ source (ENUM)       │      │ created_at             │           │
    │ source_id           │      └────────────────────────┘           │
    │ sdf_path (S3)       │                  │ 1                      │
    │ created_at          │                  │                        │
    └─────────────────────┘                  │                        │
              │ 1                            │                        │
              │                    N ┌───────┴────────────────────┐   │
              └─────────────────────►│       docking_jobs          │   │
                                  N  ├────────────────────────────┤   │
                                     │ id (UUID PK)               │   │
                                     │ user_id (FK→users) ────────┼───┘
                                     │ molecule_id (FK)           │
                                     │ protein_id (FK)            │
                                     │ engine (ENUM)              │
                                     │ exhaustiveness (INT)       │
                                     │ num_poses (INT)            │
                                     │ pocket_center (JSONB)      │
                                     │ pocket_size (JSONB)        │
                                     │ status (ENUM)              │
                                     │ celery_task_id             │
                                     │ started_at                 │
                                     │ completed_at               │
                                     │ error_message              │
                                     └────────────────────────────┘
                                                  │ 1
                                                  │
                                      ┌───────────┴──────────────┐
                                    N │     docking_results       │
                                      ├──────────────────────────┤
                                      │ id (UUID PK)             │
                                      │ job_id (FK)              │
                                      │ pose_rank (INT)          │
                                      │ vina_score (FLOAT)       │
                                      │ rmsd_lb (FLOAT)          │
                                      │ rmsd_ub (FLOAT)          │
                                      │ estimated_kd (FLOAT)     │
                                      │ pose_pdb_path (S3)       │
                                      │ interactions (JSONB)     │
                                      │ admet (JSONB)            │
                                      │ created_at               │
                                      └──────────────────────────┘

┌─────────────────────┐      ┌───────────────────────────────────┐
│    agent_sessions   │      │          batch_jobs               │
├─────────────────────┤      ├───────────────────────────────────┤
│ id (UUID PK)        │      │ id (UUID PK)                      │
│ user_id (FK→users)  │      │ user_id (FK→users)                │
│ screen_context      │      │ protein_id (FK→proteins)          │
│ job_id (FK nullable)│      │ library_source (ENUM)             │
│ messages (JSONB)    │      │ library_path (S3)                 │
│ tool_calls (JSONB)  │      │ total_compounds (INT)             │
│ created_at          │      │ screened (INT) ← live counter     │
│ last_message_at     │      │ hits (INT)                        │
└─────────────────────┘      │ status (ENUM)                     │
                             │ filters (JSONB)                   │
                             │ settings (JSONB)                  │
                             └───────────────────────────────────┘
```

### Row-Level Security

Every table with user data has PostgreSQL RLS policies applied:

```sql
-- Example: users can only see their own docking jobs
CREATE POLICY "users_own_jobs" ON docking_jobs
  FOR ALL USING (user_id = auth.uid());

-- Public proteins are visible to all, private proteins only to owner
CREATE POLICY "proteins_visibility" ON proteins
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
```

---

## ◈ AI Agent Architecture

### How the Agent Actually Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ALPHADOCK AI AGENT                               │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  Dynamic System Prompt                           │  │
│  │                                                                   │  │
│  │  ROLE: Autonomous computational chemistry agent                  │  │
│  │  SCREEN: {current_screen}                                        │  │
│  │  MOLECULE: {smiles} ({name}, {mw} Da)                           │  │
│  │  PROTEIN: {pdb_id} ({name})                                     │  │
│  │  JOB: {job_id} | status: {status} | best: {score} kcal/mol     │  │
│  │  TOOLS: [{screen-specific tool registry}]                       │  │
│  │  RULES: confirm destructive · never fabricate scores            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                          │
│  ┌─────────┐   messages[]   ▼   tool_use blocks                        │
│  │  User   │ ─────────────► Claude API ──────────────────────────►┐   │
│  │  Input  │ ◄─────────────  claude-sonnet-4-6                    │   │
│  └─────────┘   text response   ◄──────────────────────────────────┘   │
│                                        │                               │
│               ┌────────────────────────┤ tool_use detected             │
│               │                        │                               │
│               ▼                        ▼                               │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │                    TOOL EXECUTOR                            │      │
│  │                                                              │      │
│  │  Molecule Tools      Draw Tools        Docking Tools        │      │
│  │  ─────────────       ──────────        ─────────────        │      │
│  │  validate_smiles     add_atom          start_docking        │      │
│  │  load_molecule       add_bond          stop_docking         │      │
│  │  search_pubchem      add_ring          set_view_mode        │      │
│  │  search_chembl       add_substituent   toggle_water         │      │
│  │  search_zinc         delete_atom       select_pose          │      │
│  │  run_admet           clear_canvas      run_resistance       │      │
│  │  suggest_analogues   export_smiles     explain_score        │      │
│  │                                                              │      │
│  │  Analysis Tools                                              │      │
│  │  ──────────────                                              │      │
│  │  interpret_interactions  ·  flag_admet_liabilities          │      │
│  │  generate_report         ·  compare_poses                   │      │
│  │  search_literature       ·  design_analogue                 │      │
│  └──────────────────────────┬──────────────────────────────────┘      │
│                             │ tool_result                              │
│                             ▼                                          │
│            Append to messages[] → loop back to Claude API             │
│            (max 10 iterations · prevents infinite loops)              │
│                             │                                          │
│                             ▼ Final text response                      │
│                    WebSocket → Browser                                 │
│                    agent_sessions.tool_calls ← audit log               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tool Availability Per Screen

```
                        ┌─────────────────────────────────────────┐
                        │         SCREEN-SCOPED TOOL REGISTRY      │
                        └─────────────────────────────────────────┘

/input   ───► validate_smiles · load_molecule · search_pubchem
             search_chembl · search_zinc · fetch_pdb
             fetch_alphafold · run_admet · suggest_analogues

/draw    ───► add_atom · add_bond · add_ring · add_substituent
             delete_atom · clear_canvas · undo_last
             export_smiles · validate_smiles

/dock    ───► start_docking · stop_docking · set_view_mode
             toggle_water · toggle_electrostatic · select_pose
             explain_score · run_resistance_panel
             run_selectivity_screen · clean_structure · compare_poses

/results ───► explain_score · interpret_interactions
             flag_admet_liabilities · compare_poses
             search_literature · generate_report · suggest_analogues

/report  ───► generate_report · design_analogue · search_literature
             explain_score · flag_admet_liabilities
```

---

## ◈ Docking Compute Pipeline

### Engine Selection Logic

```
                    ┌─────────────────────────────────┐
                    │     STRATEGY SELECTOR            │
                    │     docking_service.py           │
                    └────────────────┬────────────────┘
                                     │
                         Analyse ligand properties
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
    MW≤500 AND              Covalent warhead             MW>600 OR
    rot_bonds≤10            detected by SMARTS           macrocycle OR
    no warhead              (nitrile, acrylamide,        peptide-like
                            vinyl sulfone, epoxide)
          │                          │                          │
          ▼                          ▼                          ▼
  ┌───────────────┐       ┌──────────────────┐      ┌──────────────────┐
  │  AutoDock     │       │     GNINA 1.0.3  │      │    DiffDock      │
  │  Vina 1.2.5   │       │                  │      │                  │
  │               │       │  MCMC sampling   │      │  Diffusion model │
  │  Empirical    │       │  + CNN rescoring │      │  on product      │
  │  scoring      │       │                  │      │  space           │
  │               │       │  85.29% success  │      │                  │
  │  49-62%       │       │  rate on kinases │      │  Best for large  │
  │  success      │       │  vs 62.69% Vina  │      │  flexible        │
  │  rate         │       │                  │      │  ligands         │
  │               │       │  Returns: Vina   │      │                  │
  │  Returns:     │       │  affinity + CNN  │      │  Returns: top-K  │
  │  kcal/mol     │       │  score + CNN     │      │  poses with      │
  │  9 poses      │       │  affinity        │      │  confidence      │
  └───────────────┘       └──────────────────┘      └──────────────────┘
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
                          ┌──────────┴──────────┐
                          │  PLIP interaction   │
                          │  profiling          │
                          │  H-bonds · hydro    │
                          │  pi-stack · salt    │
                          └──────────┬──────────┘
                                     │
                          ┌──────────┴──────────┐
                          │  ADMETlab 3.0       │
                          │  88 endpoints       │
                          │  (parallel worker)  │
                          └──────────┬──────────┘
                                     │
                          ┌──────────┴──────────┐
                          │  Results stored     │
                          │  PostgreSQL + S3    │
                          │  WebSocket: done    │
                          └─────────────────────┘
```

### Protein Preparation Pipeline

```
Raw PDB / UniProt ID / Uploaded file
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: pdbfixer 1.10                                      │
│  • Remove non-standard HETATM (keep catalytic metals)       │
│  • Patch missing residues (loops ≤ 5 residues)              │
│  • Add missing atoms                                        │
│  • Add hydrogens at pH 7.4                                  │
│  • Remove waters > 5Å from pocket centre estimate           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: propKa 3.5                                         │
│  • Predict pKa of all titratable residues from 3D structure │
│  • Assign protonation states at pH 7.4                      │
│  • His (HID/HIE/HIP) · Asp · Glu · Lys · Arg · Cys        │
│  • ΔΔG impact of wrong protonation: 1-2 kcal/mol           │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: OpenMM 8.1 (10 steps, backbone restrained)         │
│  • Energy minimise side chains                              │
│  • Remove clashes from pdbfixer-patched residues            │
│  • Reduces score variance by ≈ 0.3 kcal/mol                │
│  • Skipped for proteins > 5000 residues                     │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: P2Rank 2.4 (< 1 second)                           │
│  • ML-based pocket detection on solvent accessible surface  │
│  • Returns: rank · volume (Å³) · score · centre (x,y,z)   │
│  • Top pocket auto-selected as Vina docking box             │
│  • Outperforms Fpocket, SiteHound, MetaPocket, DeepSite    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
  Store prepared PDB → S3
  Store pocket data → PostgreSQL JSONB
  Cache: 30 days (same PDB reused by other users)
```

---

## ◈ API Architecture

### Endpoint Map

```
/api/v1/
├── auth/
│   ├── POST   /register          Create account
│   ├── POST   /login             JWT access + refresh tokens
│   ├── POST   /refresh           Refresh token exchange
│   ├── POST   /logout            Invalidate refresh token
│   ├── GET    /me                Current user profile
│   ├── PUT    /me                Update profile
│   ├── POST   /google            OAuth code exchange
│   ├── POST   /api-key           Generate API key
│   └── DELETE /api-key           Revoke API key
│
├── molecules/
│   ├── GET    /                  List saved molecules (paginated)
│   ├── POST   /                  Save molecule
│   ├── GET    /{id}              Get molecule
│   ├── DELETE /{id}              Delete molecule
│   ├── POST   /validate          Validate SMILES (no save)
│   ├── POST   /from-name         Drug name → SMILES (PubChem)
│   ├── POST   /from-cid          Import from PubChem CID
│   ├── POST   /from-chembl       Import from ChEMBL ID
│   ├── POST   /from-zinc         Import from ZINC ID
│   ├── POST   /admet             Run ADMET prediction
│   ├── POST   /upload-sdf        Parse SDF file
│   ├── POST   /upload-csv        Parse CSV with SMILES column
│   └── GET    /{id}/2d-image     2D structure PNG (RDKit)
│
├── proteins/
│   ├── GET    /                  List proteins + public cache
│   ├── POST   /from-pdb          Fetch + prepare PDB structure
│   ├── POST   /from-uniprot      Fetch AlphaFold model
│   ├── POST   /upload            Upload own PDB/mmCIF
│   ├── GET    /{id}              Get protein with pockets
│   ├── GET    /{id}/pdb          Download prepared PDB
│   ├── GET    /{id}/pockets      List detected pockets
│   ├── POST   /{id}/prepare      Re-run preparation pipeline
│   └── DELETE /{id}              Delete protein + S3 files
│
├── jobs/
│   ├── POST   /                  Create docking job → Celery
│   ├── GET    /                  List jobs (paginated, filterable)
│   ├── GET    /{id}              Job status + metadata
│   ├── DELETE /{id}              Cancel / delete job
│   ├── POST   /{id}/retry        Re-queue failed job
│   ├── GET    /{id}/log          Stream log (Server-Sent Events)
│   ├── GET    /{id}/results      All poses + ADMET + interactions
│   ├── GET    /{id}/results/{r}  Single pose by rank
│   ├── GET    /{id}/results/{r}/pdb  Download pose PDB
│   ├── POST   /{id}/resistance-panel  Multi-mutant batch
│   └── POST   /{id}/selectivity-screen  Off-target cross-dock
│
├── batch/
│   ├── POST   /                  Create batch job
│   ├── GET    /                  List batch jobs
│   ├── GET    /{id}              Status + live counters
│   ├── DELETE /{id}              Cancel / delete
│   ├── GET    /{id}/hits         Top N hits sorted by score
│   ├── GET    /{id}/export       Download all results CSV
│   └── GET    /{id}/export-sdf   Download top N as SDF
│
├── agent/
│   ├── POST   /message           User message → Claude → response
│   ├── GET    /session/{id}      Get conversation history
│   ├── DELETE /session/{id}      Clear history
│   ├── POST   /tool-call         Execute specific tool
│   ├── GET    /tool-log/{sid}    Audit log of tool calls
│   ├── POST   /interpret         One-shot job interpretation
│   ├── POST   /suggest-analogues SMILES → modifications list
│   └── POST   /design-analogue   SMILES + target → new SMILES
│
└── reports/
    ├── POST   /generate          Generate AI report for job
    ├── GET    /{id}              Get report (JSON)
    ├── GET    /{id}/pdf          Download PDF (WeasyPrint)
    ├── GET    /{id}/docx         Download Word document
    └── POST   /{id}/share        Shareable link (30-day expiry)

WebSocket Channels
├── /ws/jobs/{job_id}      pose_evaluated · step_complete · job_done · job_failed
├── /ws/batch/{batch_id}   compound_screened · hit_found · batch_done
└── /ws/agent/{session_id} agent_typing · tool_executing · tool_result · message_complete
```

---

## ◈ Infrastructure & Kubernetes

### Production Cluster on GKE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GKE CLUSTER (alphadock-prod)                            │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  NAMESPACE: alphadock                                                 │ │
│  │                                                                        │ │
│  │  api-deployment          web-deployment                               │ │
│  │  ┌──────────────┐        ┌──────────────┐                            │ │
│  │  │ api-pod-1    │        │ web-pod-1    │                            │ │
│  │  │ api-pod-2    │        │ web-pod-2    │                            │ │
│  │  │ api-pod-3    │        └──────────────┘                            │ │
│  │  └──────────────┘        HPA: CPU>70% → scale                       │ │
│  │  HPA: CPU>60% → +2       Min: 2  Max: 6                              │ │
│  │  Min: 3  Max: 10                                                      │ │
│  │                                                                        │ │
│  │  worker-cpu-deployment   worker-gpu-deployment                        │ │
│  │  ┌──────────────┐        ┌──────────────────────────┐                │ │
│  │  │ cpu-pod-1    │        │ gpu-pod (0 when idle)    │                │ │
│  │  │ cpu-pod-2    │        │                          │                │ │
│  │  │ cpu-pod-3    │        │ KEDA ScaledObject:       │                │ │
│  │  │ cpu-pod-4    │        │ watch gpu_docking queue  │                │ │
│  │  └──────────────┘        │ depth > 0 → provision    │                │ │
│  │  KEDA: queue depth > 5   │ NVIDIA T4 node           │                │ │
│  │  → scale up workers      │ Max replicas: 4          │                │ │
│  │  Min: 4  Max: 20         └──────────────────────────┘                │ │
│  │                                                                        │ │
│  │  redis-statefulset       external-secrets-operator                   │ │
│  │  ┌──────────────┐        ┌──────────────────────────┐                │ │
│  │  │ redis-0      │        │ Pulls secrets from       │                │ │
│  │  │ redis-1      │        │ GCP Secret Manager:      │                │ │
│  │  │ (Sentinel HA)│        │ ANTHROPIC_API_KEY        │                │ │
│  │  └──────────────┘        │ JWT_SECRET_KEY           │                │ │
│  │                           │ DB credentials          │                │ │
│  │                           └──────────────────────────┘                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐  │
│  │  Cloud SQL        │  │  Cloud Memorystore │  │  Google Cloud Storage │  │
│  │  PostgreSQL 16    │  │  Redis 7           │  │  (S3-compatible)      │  │
│  │  Managed HA       │  │  Managed HA        │  │  PDB files, poses     │  │
│  │  PITR backups     │  │  10GB              │  │  Reports, libraries   │  │
│  └───────────────────┘  └───────────────────┘  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
   ┌──────────┴──────────┐                  ┌────────────┴──────────┐
   │  Nginx Ingress       │                  │  cert-manager         │
   │  path routing:       │                  │  Let's Encrypt TLS    │
   │  /api/* → api-svc    │                  │  auto-renew           │
   │  /ws/*  → api-svc    │                  └───────────────────────┘
   │  /*     → web-svc    │
   └──────────────────────┘
```

### Resource Allocation

| Deployment | CPU Request | CPU Limit | Memory | GPU | Notes |
|-----------|-------------|-----------|--------|-----|-------|
| `api-deployment` | 500m | 1000m | 1Gi / 2Gi | — | 4 uvicorn workers per pod |
| `worker-cpu` | 1000m | 2000m | 2Gi / 4Gi | — | 1 Celery job per worker |
| `worker-gpu` | 2000m | 4000m | 8Gi / 16Gi | 1× T4 | GNINA + DiffDock |
| `web-deployment` | 100m | 500m | 256Mi / 512Mi | — | Static build via Nginx |

---

## ◈ CI/CD Pipeline

### Full Pipeline Flow

```
Developer pushes feature/TICKET-short-desc
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PULL REQUEST TO develop                          │
│                         ci.yml                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │ lint-frontend  │  │ lint-backend   │  │ security-scan        │  │
│  │                │  │                │  │                      │  │
│  │ ESLint         │  │ ruff check .   │  │ CodeQL analysis      │  │
│  │ Prettier check │  │ mypy app/      │  │ OWASP dep-check      │  │
│  │ tsc --noEmit   │  │                │  │ Block if CVSS ≥ 7    │  │
│  └────────────────┘  └────────────────┘  └──────────────────────┘  │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │test-frontend   │  │ test-backend   │  │ build-docker         │  │
│  │                │  │                │  │                      │  │
│  │ Vitest unit    │  │ pytest -v      │  │ docker build api     │  │
│  │ Coverage ≥ 70% │  │ Coverage ≥ 80% │  │ docker build worker  │  │
│  │                │  │                │  │ Verify images build  │  │
│  └────────────────┘  └────────────────┘  └──────────────────────┘  │
│                                                                      │
│         All jobs must pass → PR can merge                           │
└─────────────────────────────────────────────────────────────────────┘
            │ merge to develop
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   STAGING DEPLOYMENT                                │
│                     cd-staging.yml                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Build images with SHA tag                                          │
│  Push to gcr.io/alphadock-staging/...                               │
│  ArgoCD sync: alphadock-staging                                     │
│  kubectl rollout status (wait for healthy)                          │
│  Run Playwright E2E (critical paths)                                │
│  Notify #deployments Slack channel                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
            │ merge to main (2 approvals required)
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  PRODUCTION DEPLOYMENT                              │
│                       cd-prod.yml                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Build images with semver tag (vX.Y.Z)                             │
│  Push to gcr.io/alphadock-prod/...                                  │
│  ArgoCD sync: alphadock-prod (GitOps)                               │
│  Canary rollout: 10% → 50% → 100% over 30 minutes                 │
│  Smoke tests at each stage                                          │
│  Auto-rollback if error rate > 1% during rollout                   │
│  PagerDuty alert on failure                                         │
│  Notify #deployments Slack channel                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Branch Protection Rules

| Branch | Approvals | CI Required | Direct Push |
|--------|-----------|-------------|-------------|
| `main` | 2 | All jobs passing | ❌ Never |
| `develop` | 1 | All jobs passing | ❌ Never |
| `feature/*` | — | Recommended | ✅ Author only |
| `hotfix/*` | 1 (immediate) | All jobs passing | ❌ Never |

---

## ◈ Tool & Integration Map

### Complete External Tool Directory

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ALPHADOCK INTEGRATION MAP                               │
│                                                                             │
│  DOCKING ENGINES                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  AutoDock Vina 1.2.5          GNINA 1.0.3            DiffDock      │   │
│  │  Apache 2.0 · CPU-only        Apache 2.0 · GPU        MIT · GPU    │   │
│  │  49-62% success rate          85.29% success rate     Best for      │   │
│  │  Default for MW≤500           Best for GPCRs,         macrocycles,  │   │
│  │  pip install vina             kinases, warheads        MW>600,      │   │
│  │                               MCMC + CNN rescoring     peptides     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROTEIN STRUCTURE                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  AlphaFold2 EBI API           SiteAF3 (Phase 3)       pdbfixer     │   │
│  │  200M+ structures free        Conditional diffusion   Structure     │   │
│  │  pLDDT confidence scores      on AF3 backbone         repair        │   │
│  │  UniProt → PDB download       Allosteric/orphan       Missing atoms │   │
│  │                               proteins                + residues    │   │
│  │                                                                     │   │
│  │  propKa 3.5                   OpenMM 8.1              P2Rank 2.4   │   │
│  │  Protonation at pH 7.4        Side chain              ML pocket     │   │
│  │  His/Asp/Glu/Lys/Arg          minimisation            detection     │   │
│  │  Critical for docking         10-step restrained      <1s runtime   │   │
│  │  accuracy                     backbone                Top 5 pockets │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  CHEMINFORMATICS                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  RDKit 2024.09                RDKit.js (WASM)          Meeko 0.5   │   │
│  │  BSD-3 · Server-side          Client-side              PDBQT prep  │   │
│  │  SMILES/InChI/2D/3D           Instant validation       For Vina/   │   │
│  │  Lipinski/PAINS/ECFP4         <50ms zero network       GNINA       │   │
│  │  SA score/QED/MCS             Same C++ core as         Gasteiger   │   │
│  │  PostgreSQL cartridge         server RDKit             charges     │   │
│  │                                                                     │   │
│  │  PLIP 2.3                                                          │   │
│  │  GPL-2.0 · Python lib                                              │   │
│  │  H-bonds · hydrophobic                                             │   │
│  │  pi-stack · salt bridge                                            │   │
│  │  halogen bonds · water bridges                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ADMET PREDICTION                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ADMETlab 3.0 (Primary)       ProTox-3 (Secondary)   pkCSM        │   │
│  │  Free · 88 endpoints          Organ toxicity          BBB + Caco-2 │   │
│  │  Multi-task graph attention   hepato/nephro/cardio    validation   │   │
│  │  BBB 0.90 accuracy            Independent second      Ascher Lab   │   │
│  │  CYP2C9 0.94 accuracy         opinion on toxicity     Cambridge    │   │
│  │  Best free ADMET tool         Preissner group                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  CHEMICAL DATABASES                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  PubChem (NCBI)               ChEMBL (EMBL-EBI)      ZINC-22      │   │
│  │  100M+ compounds              2.4M compounds          54.9B mols   │   │
│  │  Name → SMILES                20.3M bioactivity       5.9B in 3D  │   │
│  │  5 req/s free                 IC50/Ki curated         Purchasable  │   │
│  │  Broadest coverage            Manually curated        Drug-like    │   │
│  │                               from literature                      │   │
│  │                                                                     │   │
│  │  DrugBank                     COCONUT                 RCSB PDB    │   │
│  │  14,000+ approved drugs       400,000+ natural        220,000+    │   │
│  │  Drug repurposing             products                structures   │   │
│  │  Mechanism context            64 unified sources      Resistance   │   │
│  │  FDA library (2,340)          Novel scaffolds         mutants     │   │
│  │                               Neglected diseases                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  VISUALISATION                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Mol* (Molstar) 4.x                                               │   │
│  │  MIT · Joint PDBe + RCSB PDB                                      │   │
│  │  Primary viewer on AlphaFold DB, PDBe, RCSB PDB                   │   │
│  │  WebGL · handles 13M+ atoms                                       │   │
│  │  Programmable JS API for agent tool calls                         │   │
│  │  Surface/Stick/Sphere/Ribbon/Cartoon representations              │   │
│  │  Electrostatic surface · Measurement tools                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Score Interpretation Reference

| Vina Score | Estimated Kd | Interpretation |
|-----------|--------------|----------------|
| ≤ −10.0 kcal/mol | < 0.5 nM | ⭐⭐⭐ **Exceptional** — sub-nanomolar, best-in-class kinase inhibitor territory |
| −9.0 to −10.0 | 0.5 – 2.5 nM | ⭐⭐⭐ **Excellent** — clinical-stage compound territory |
| −7.5 to −9.0 | 2.5 – 100 nM | ⭐⭐ **Good** — drug discovery hit threshold |
| −6.0 to −7.5 | 100 nM – 2 µM | ⭐ **Moderate** — may need optimisation |
| −4.5 to −6.0 | 2 µM – 1 mM | **Weak** — borderline meaningful |
| > −4.5 | > 1 mM | **Non-binder** — no meaningful affinity predicted |

> **Note:** Vina scores carry ±1.4 kcal/mol typical uncertainty. Always validate promising candidates with GNINA CNN rescoring and experimental IC₅₀ measurement.

---

## ◈ Repository Structure

```
alphadock/
│
├── apps/
│   ├── web/                           ← React 18 + Vite + TypeScript
│   │   ├── src/
│   │   │   ├── app/                   ← Route-level pages
│   │   │   │   ├── landing/page.tsx
│   │   │   │   ├── input/page.tsx
│   │   │   │   ├── draw/page.tsx
│   │   │   │   ├── dock/page.tsx
│   │   │   │   ├── results/[jobId]/page.tsx
│   │   │   │   ├── report/[jobId]/page.tsx
│   │   │   │   ├── batch/[batchId]/page.tsx
│   │   │   │   └── dashboard/page.tsx
│   │   │   ├── components/
│   │   │   │   ├── agent/             ← AgentSidebar · AgentMessages
│   │   │   │   ├── docking/           ← MolstarViewer · EnergyLandscape
│   │   │   │   ├── molecule/          ← DrawCanvas · SmileInput · AdmetPanel
│   │   │   │   ├── protein/           ← PocketSelector · QualityReport
│   │   │   │   ├── results/           ← PoseRankTable · InteractionList
│   │   │   │   └── batch/             ← BatchProgress · ScatterPlot
│   │   │   ├── hooks/                 ← useDockingJob · useAgentSession
│   │   │   ├── stores/                ← Zustand: job · agent · draw · view
│   │   │   └── lib/                   ← api.ts · ws.ts · rdkit.ts
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                           ← FastAPI Python 3.12
│       ├── app/
│       │   ├── main.py                ← App factory · CORS · middleware
│       │   ├── core/                  ← config · database · redis · security
│       │   ├── routers/               ← auth · molecules · proteins · jobs
│       │   │                            batch · agent · reports · ws
│       │   ├── models/                ← SQLAlchemy ORM models
│       │   ├── schemas/               ← Pydantic request/response schemas
│       │   ├── services/              ← molecule · protein · docking
│       │   │                            admet · agent · report services
│       │   └── tasks/                 ← Celery task definitions
│       ├── alembic/                   ← Database migrations (+ RLS policies)
│       ├── tests/
│       │   ├── unit/                  ← Service unit tests
│       │   └── integration/           ← API endpoint integration tests
│       └── pyproject.toml
│
├── workers/
│   └── docking/                       ← Celery compute workers
│       ├── celeryconfig.py            ← Broker · backend · queues
│       ├── tasks/
│       │   ├── dock_vina.py           ← Full Vina pipeline
│       │   ├── dock_gnina.py          ← GNINA GPU pipeline
│       │   ├── dock_diffdock.py       ← DiffDock pipeline
│       │   ├── prepare_protein.py     ← pdbfixer→propKa→OpenMM→P2Rank
│       │   └── batch_screen.py        ← Parallel library screening
│       └── lib/                       ← rdkit_utils · meeko_utils · plip_utils
│
├── infra/
│   ├── terraform/                     ← GCP infra as code (GKE, Cloud SQL)
│   ├── k8s/                           ← Kubernetes manifests (Kustomize)
│   │   ├── api/                       ← deployment · service · hpa
│   │   ├── workers/                   ← cpu + gpu deployments · keda
│   │   ├── ingress/                   ← nginx · cert-manager
│   │   ├── monitoring/                ← prometheus · grafana
│   │   └── secrets/                   ← external-secrets (GCP Secret Manager)
│   └── docker/                        ← Dockerfiles per service
│
├── scripts/
│   ├── seed.py                        ← Dev database seed
│   ├── download_libraries.py          ← Pre-download screening libraries
│   └── validate_install.sh            ← Check all binaries present
│
├── docs/                              ← Architecture diagrams · ADRs · API ref
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                     ← PR: lint + type + test + build + scan
│   │   ├── cd-staging.yml             ← Push develop: deploy staging + E2E
│   │   ├── cd-prod.yml                ← Push main: canary deploy to prod
│   │   └── codeql.yml                 ← Weekly security scan
│   └── CODEOWNERS
├── .env.example                       ← All required env vars documented
├── turbo.json                         ← Turborepo pipeline
├── docker-compose.yml                 ← Full local dev stack
└── Makefile                           ← Dev shortcuts
```

---

## ◈ Getting Started

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Docker Desktop | 4.x+ | [docker.com](https://docker.com/get-started) |
| Node.js | 20 LTS | `nvm install 20` |
| Python | 3.12 | `pyenv install 3.12` |
| Java JRE | 11+ | `brew install openjdk` |
| make | any | pre-installed macOS / `apt install make` |

### Quick Start

```bash
# 1. Clone
git clone https://github.com/alphadock/alphadock.git
cd alphadock

# 2. Configure environment
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, JWT_SECRET_KEY (openssl rand -hex 32)
# Other values are pre-set for local development

# 3. Install dependencies + run migrations
make setup

# 4. Start full stack
make dev
```

Services start at:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React + Vite (HMR enabled) |
| **API** | http://localhost:8000 | FastAPI |
| **API Docs** | http://localhost:8000/docs | Auto-generated OpenAPI |
| **Celery Monitor** | http://localhost:5555 | Flower task monitoring |
| **MinIO Console** | http://localhost:9001 | S3 browser (local storage) |

```bash
# 5. Seed test data
make seed
# Creates: test@alphadock.io / testpass123
#          Imatinib, Erlotinib, Ibuprofen molecules
#          BCR-ABL (1IEP), EGFR (1XKK) proteins

# 6. Verify docking binaries
make validate
# Checks: vina, gnina, java/p2rank
```

### Your First Docking Job

1. Open http://localhost:3000
2. Navigate to **Input** → paste SMILES: `CC1=CC=C(C=C1)NC2=NC=CC(=N2)NC3=CC(=C(C=C3)CN4CCN(CC4)C)OC`
3. Navigate to **Protein** → enter PDB ID: `1IEP` → click Fetch
4. Click **Run Docking**
5. Watch the live 3D simulation — energy landscape builds pose by pose
6. View results → click **Generate AI Report**

---

## ◈ Environment Variables

### Required — API Service

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@db:5432/alphadock` | Async PostgreSQL (asyncpg driver) |
| `REDIS_URL` | `redis://redis:6379/0` | Broker, pub/sub, app cache |
| `JWT_SECRET_KEY` | `<32-byte hex>` | HS256 token signing. `openssl rand -hex 32` |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Claude API — **never expose to browser** |
| `AWS_S3_BUCKET` | `alphadock-local` | S3/MinIO bucket |
| `AWS_ACCESS_KEY_ID` | `minioadmin` | S3 credentials |
| `AWS_SECRET_ACCESS_KEY` | `minioadmin` | S3 credentials |
| `AWS_ENDPOINT_URL` | `http://minio:9000` | Local MinIO only — omit in production |
| `CELERY_BROKER_URL` | `redis://redis:6379/0` | Celery task broker |

### Required — Workers

| Variable | Example | Description |
|----------|---------|-------------|
| `VINA_PATH` | `/usr/local/bin/vina` | AutoDock Vina binary path |
| `GNINA_PATH` | `/usr/local/bin/gnina` | GNINA binary (GPU worker) |
| `P2RANK_JAR` | `/opt/p2rank/p2rank.jar` | P2Rank JAR path |
| `ADMETLAB_API_URL` | `https://admetmesh.scbdd.com` | ADMETlab 3.0 base URL |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_GPU_WORKERS` | `false` | Enable GNINA/DiffDock GPU queue |
| `ENABLE_BATCH_SCREEN` | `true` | Batch virtual screening feature |
| `DEFAULT_EXHAUSTIVENESS` | `16` | Vina default exhaustiveness |
| `AGENT_MAX_TOOL_ITERATIONS` | `10` | Max tool-call loops per agent request |
| `ADMET_CACHE_TTL_SECONDS` | `86400` | ADMET Redis cache TTL (24h) |

---

## ◈ Application Pages

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | **Landing** | Marketing, pitch, feature showcase |
| `/dashboard` | **Dashboard** | Job history, quick-launch, AI feed |
| `/input` | **Input** | SMILES, protein, upload, batch — five tabs |
| `/draw` | **Draw** | 2D structure editor with AI Super Draw access |
| `/dock` | **Docking Lab** | Live 3D simulation with real-time energy landscape |
| `/results/[jobId]` | **Results** | All poses, interactions, ADMET, resistance panel |
| `/report/[jobId]` | **AI Report** | Claude-generated binding analysis and next steps |
| `/batch/[batchId]` | **Batch Results** | Live leaderboard for virtual screening |
| `/settings` | **Settings** | Profile, API keys, preferences |
| `/admin` | **Admin** | Worker health, queue depth, user activity (internal) |

---

## ◈ Feature Reference

### Feature Status

| Feature | Status | Phase | Notes |
|---------|--------|-------|-------|
| SMILES input + validation | ✅ | MVP | Client-side RDKit.js WASM |
| Drug name search (PubChem) | ✅ | MVP | Cached 7 days |
| 2D structure drawing | ✅ | MVP | AI Super Draw access |
| PDB protein fetch | ✅ | MVP | P2Rank pocket detection |
| AlphaFold2 protein fetch | ✅ | MVP | pLDDT confidence display |
| AutoDock Vina docking | ✅ | MVP | Live WebSocket streaming |
| Live 3D Mol* viewer | ✅ | MVP | PLIP interaction display |
| ADMET profiling (ADMETlab 3.0) | ✅ | MVP | 88 endpoints |
| AI agent (Claude) | ✅ | MVP | Tool use on every screen |
| PDF report generation | ✅ | Phase 2 | WeasyPrint |
| GNINA CNN-rescored docking | ✅ | Phase 2 | GPU workers |
| DiffDock diffusion docking | ✅ | Phase 2 | GPU workers |
| Batch virtual screening | ✅ | Phase 2 | Up to 10,000 compounds |
| Resistance mutation panel | ✅ | Phase 2 | 5 protein families |
| Selectivity screen | ✅ | Phase 2 | Off-target kinase panel |
| MMP / SAR analysis | 🔄 | Phase 2 | RDKit MMP |
| Fragment growing (BRICS) | 📋 | Phase 3 | Fragment-based drug design |
| 3D pharmacophore search | 📋 | Phase 3 | RDKit Pharm3D + ZINC-22 |
| SiteAF3 docking | 📋 | Phase 3 | Allosteric/orphan targets |
| Molecular dynamics preview | 📋 | Phase 3 | Short OpenMM trajectories |
| De novo generation | 📋 | Phase 4 | REINVENT integration |
| PROTAC/molecular glue | 📋 | Phase 4 | Ternary complex modelling |

---

## ◈ Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.3 | UI framework with concurrent rendering |
| TypeScript | 5.6 | Type safety |
| Vite | 6.x | Build tool + dev server (HMR) |
| @tanstack/react-query | 5.x | Server state management |
| Zustand | 5.x | Client state (agent, canvas, view) |
| molstar | 4.x | WebGL 3D molecular viewer |
| @rdkit/rdkit | 2024.09 | WASM cheminformatics (client-side) |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Framer Motion | 11.x | Animations |
| Recharts | 2.x | Score charts, ADMET bars |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.115 | Async web framework |
| SQLAlchemy | 2.0 (async) | ORM with asyncpg |
| Alembic | 1.14 | Database migrations |
| Celery | 5.4 | Distributed task queue |
| rdkit-pypi | 2024.09 | Core cheminformatics |
| vina | 1.2.5 | AutoDock Vina Python bindings |
| meeko | 0.5 | PDBQT ligand preparation |
| plip | 2.3 | Protein-ligand interaction profiler |
| pdbfixer | 1.10 | Protein structure repair |
| propka | 3.5 | Protonation state assignment |
| openmm | 8.1 | Molecular mechanics minimisation |
| anthropic | 0.40 | Claude API client |
| weasyprint | 62 | PDF report generation |
| boto3 | 1.35 | S3/MinIO file storage |

### Infrastructure

| Tool | Purpose |
|------|---------|
| Docker + Compose | Containerisation + local dev stack |
| Kubernetes (GKE) | Production orchestration |
| Terraform | Infrastructure as Code |
| KEDA | Event-driven GPU pod autoscaling |
| ArgoCD | GitOps continuous deployment |
| Nginx | Ingress, TLS, rate limiting |
| Prometheus + Grafana | Metrics and alerting |
| Sentry | Error tracking |
| GitHub Actions | CI/CD pipelines |

---

## ◈ Makefile Reference

```bash
make dev              # Start full stack (docker-compose up --build)
make setup            # Install deps + run migrations
make test             # All tests (frontend + backend)
make test-backend     # pytest with coverage report
make test-frontend    # Vitest unit tests
make test-e2e         # Playwright E2E tests
make lint             # ruff + eslint
make format           # ruff format + prettier
make migrate          # Apply pending Alembic migrations
make migrate-create msg="description"  # New migration
make seed             # Seed dev database
make validate         # Check all binaries (vina, gnina, java)
make worker-logs      # Tail Celery worker logs
make flower           # Open Celery monitoring (localhost:5555)
make shell-api        # Bash inside API container
make shell-worker     # Bash inside worker container
make db-shell         # PostgreSQL CLI
make redis-cli        # Redis CLI
make db-reset         # Drop all data + restart fresh
make clean            # Stop all services + remove volumes
```

---

## ◈ Contributing

### Development Flow

```bash
# 1. Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/TICK-123-your-feature

# 2. Make changes, run tests locally
make test
make lint

# 3. Open PR to develop
# Fill in the PR template
# - What does this change?
# - What tests were added?
# - Any new env vars?

# 4. After review + CI passes → merge to develop
# Staging deployment is automatic

# 5. Staging → production is a separate PR: develop → main
# Requires 2 approvals
```

### Adding a New Docking Engine

1. Create `workers/docking/tasks/dock_newengine.py`
2. Register in `celeryconfig.py` task routes
3. Add to `docking_service.py` strategy selector
4. Add engine option to `EngineSelector` React component
5. Add Alembic migration for the new `engine` ENUM value
6. Add integration tests in `tests/integration/test_jobs_api.py`

### Adding a New Agent Tool

1. Define schema in `agent_service.py` TOOL_REGISTRY
2. Implement in `execute_tool()` switch statement
3. Add to `SCREEN_TOOLS[screen_name]` list (controls availability per screen)
4. For frontend-side tools: add WS message handler in `ws.ts`
5. Write unit test in `tests/unit/test_agent_service.py`

---

## ◈ Architecture Decision Records

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Monorepo (Turborepo) | Atomic commits, shared TypeScript types, unified CI |
| ADR-002 | Celery over FastAPI background tasks | Jobs are 30s–20min, must be resumable and cancellable |
| ADR-003 | Redis pub/sub for WS bridge | Multiple API pods need to receive worker events |
| ADR-004 | PostgreSQL RLS over application filtering | Database-level data isolation is a security guarantee |
| ADR-005 | RDKit.js WASM client-side | <50ms instant feedback vs 100-300ms API round-trip per keystroke |
| ADR-006 | Claude tool use vs RAG | Agent must execute actions, not just describe them |
| ADR-007 | ADMETlab 3.0 over SwissADME | BBB accuracy 0.90 vs 0.65; CYP2C9 accuracy 0.94 vs 0.70 |
| ADR-008 | Mol* over custom Three.js | Production-grade, 13M+ atoms, programmable API, maintained by PDBe/RCSB |

---

## ◈ Monitoring & Observability

### Key Metrics (Prometheus)

| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| `docking_job_duration_seconds` | Histogram | p95 > 300s |
| `docking_jobs_queued_total` | Gauge | > 50 → scale workers |
| `docking_jobs_failed_total` | Counter | > 5/min |
| `api_request_duration_seconds` | Histogram | p99 > 2s |
| `claude_api_tokens_used_total` | Counter | > $50/day budget alert |
| `worker_cpu_utilisation` | Gauge | > 85% sustained 5min |
| `redis_memory_used_bytes` | Gauge | > 80% of max |

### Logging

All logs are structured JSON via `structlog`. Log levels: DEBUG (dev), INFO (staging), WARNING+ (prod). Aggregated to GCP Cloud Logging → BigQuery for analytics.

---

## ◈ License

MIT License — see [LICENSE](LICENSE)

AlphaDock uses open-source tools with the following licenses:
- AutoDock Vina: Apache 2.0
- GNINA: Apache 2.0
- DiffDock: MIT
- RDKit: BSD-3
- Mol*: MIT
- PLIP: GPL-2.0 (server-side only, not distributed)
- P2Rank: MIT

---

## ◈ Citation

If AlphaDock contributes to your research, please cite:

```bibtex
@software{alphadock2026,
  title   = {AlphaDock: AI-Native Molecular Docking Platform},
  year    = {2026},
  url     = {https://github.com/alphadock/alphadock},
  note    = {AutoDock Vina · GNINA · DiffDock · Claude API · Mol*}
}
```

---

<div align="center">

**Built to democratise drug discovery.**

*Every scientist, every lab, every country.*

---

[alphadock.io](https://alphadock.io) · [docs](docs/) · [issues](issues/) · [discord](#)

</div>
