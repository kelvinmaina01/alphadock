# Environment variables

Values are examples; never commit real secrets.

## API (`apps/api`)

| Name | Example | Required (MVP) | Notes |
|------|---------|------------------|-------|
| `DATABASE_URL` | `postgresql+asyncpg://alphadock:alphadock@localhost:5432/alphadock` | Yes | Use a managed DB in production |
| `REDIS_URL` | `redis://localhost:6379/0` | Yes for workers | Job queue + WebSocket fan-out |
| `ANTHROPIC_API_KEY` | `sk-ant-…` | For AI features | Rotate keys; scope per environment |
| `CORS_ORIGINS` | `http://localhost:5173` | Dev | Comma-separated in prod |
| `S3_ENDPOINT` | MinIO or AWS | Later | Structures, SDF uploads, reports |
| `S3_BUCKET` | `alphadock-artifacts` | Later | |
| `PDB_API_BASE` | `https://data.rcsb.org` | No | Override for tests/mirror |
| `ALPHAFOLD_API_BASE` | `https://alphafold.ebi.ac.uk/api` | No | Structure fetch |
| `PUBCHEM_API_BASE` | `https://pubchem.ncbi.nlm.nih.gov/rest/pug` | No | Compound resolution |
| `CHEMBL_API_BASE` | `https://www.ebi.ac.uk/chembl/api/data` | No | Bioactivity search |

## Web (`apps/web`)

| Name | Example | Notes |
|------|---------|-------|
| `VITE_API_URL` | empty in dev | If set, API base for production builds |

## Workers (future `workers/`)

Same as API for `DATABASE_URL`, `REDIS_URL`, plus optional `CUDA_VISIBLE_DEVICES` on GPU nodes.
