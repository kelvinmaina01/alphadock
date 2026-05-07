# System Contracts

## Purpose

This document freezes the interface surface that connects the web app, API, workers, storage, and agent orchestration layers.

## Frontend routes

- `/`
- `/dashboard`
- `/input`
- `/draw`
- `/dock`
- `/results/:jobId`
- `/report/:jobId`
- `/batch/:batchId`
- `/settings`

## REST namespaces

All API routes live under `/api/v1`.

- `/auth`
- `/molecules`
- `/proteins`
- `/jobs`
- `/batch`
- `/agent`
- `/reports`

## Domain entities

### Molecule

- `id`
- `name`
- `smiles`
- `inchi`
- `formula`
- `mw`
- `logp`
- `hbd`
- `hba`
- `tpsa`
- `rotBonds`
- `qed`
- `lipinskiPass`
- `source`
- `sourceId`
- `createdAt`

### Protein

- `id`
- `name`
- `source`
- `pdbId`
- `uniprotId`
- `resolution`
- `qualityReport`
- `pockets`
- `rawArtifactKey`
- `preparedArtifactKey`
- `createdAt`

### DockingJob

- `id`
- `userId`
- `moleculeId`
- `proteinId`
- `engine`
- `status`
- `exhaustiveness`
- `numPoses`
- `pocketCenter`
- `pocketSize`
- `startedAt`
- `completedAt`
- `errorMessage`

### DockingResult

- `id`
- `jobId`
- `poseRank`
- `scoreKcalMol`
- `rmsdLb`
- `rmsdUb`
- `estimatedKdNm`
- `poseArtifactKey`
- `interactions`
- `admetSummary`
- `createdAt`

### BatchJob

- `id`
- `proteinId`
- `librarySource`
- `status`
- `totalCompounds`
- `screenedCompounds`
- `hitCount`
- `filters`
- `settings`

### AgentSession

- `id`
- `screenContext`
- `jobId`
- `messages`
- `toolCalls`
- `lastMessageAt`

## Job status model

Worker-backed jobs use:

- `pending`
- `running`
- `done`
- `failed`
- `cancelled`

Frontend local state may also use:

- `idle`

## WebSocket event model

### Docking events

- `pose_evaluated`
- `step_complete`
- `job_done`
- `job_failed`

### Agent events

- `agent_typing`
- `tool_executing`
- `message_complete`

### Batch events

- `compound_screened`
- `hit_found`

## Event payload expectations

### `pose_evaluated`

- `pose_number`
- `score`
- `rmsd_lb`
- `rmsd_ub`
- `kd_nM`

### `step_complete`

- `step`
- `duration`

### `job_done`

- `best_score`
- `best_pose_rank`
- `num_interactions`

### `job_failed`

- `error`
- `step`

### `tool_executing`

- `tool`
- `args`

### `message_complete`

- `content`
- `tool_calls`

### `compound_screened`

- `done`
- `total`
- `best_score_so_far`

### `hit_found`

- `smiles`
- `name`
- `score`

## Storage key families

Use stable, environment-agnostic logical keys:

- `proteins/raw/{protein_id}/source.pdb`
- `proteins/prepared/{protein_id}/prepared.pdb`
- `proteins/prepared/{protein_id}/pockets.json`
- `ligands/{molecule_id}/source.sdf`
- `ligands/{molecule_id}/prepared.pdbqt`
- `jobs/{job_id}/poses/pose_{rank}.pdb`
- `jobs/{job_id}/results/results.json`
- `batch/{batch_id}/input/library.sdf`
- `batch/{batch_id}/exports/top_hits.sdf`
- `reports/{report_id}/report.pdf`
- `reports/{report_id}/report.docx`

## Agent tool families

### Molecule tools

- validate SMILES
- load molecules
- search PubChem, ChEMBL, ZINC
- run ADMET
- suggest analogues

### Draw tools

- add atom
- add bond
- add ring
- add substituent
- clear canvas
- delete atom
- undo last
- export SMILES

### Docking tools

- start docking
- stop docking
- set view mode
- toggle water and overlays
- select pose
- run resistance panel
- run selectivity screen

### Analysis tools

- explain score
- interpret interactions
- flag ADMET liabilities
- generate report
- compare poses
- search literature

## Error model

All API errors should map to one of these categories:

- validation error
- authentication or authorization error
- missing resource
- upstream fetch failure
- compute pipeline failure
- storage failure
- transient infrastructure failure

Each error payload should include:

- machine-readable code
- human-readable message
- optional step or subsystem
- retryability hint where applicable

## Frontend state ownership

- Zustand owns active interactive state such as draw canvas, selected pose, current view mode, and agent panel status
- TanStack Query owns server-sourced collections, detail records, and refresh logic
- mocked data adapters must preserve this split so real data replacement does not change component ownership
