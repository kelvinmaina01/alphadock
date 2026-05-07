# Frontend Phase Plan

## Goal

Build AlphaDock as a route-complete, high-fidelity web prototype whose data model and state model are already shaped for real backend replacement.

This phase is not a disposable demo. Its output is the permanent frontend shell.

## Frontend priorities

### Highest fidelity in wave 1

- landing
- dashboard quick-launch
- input
- draw
- docking lab
- results

### Functional-first in wave 1

- report
- batch
- settings
- admin or billing if represented at all

## Implementation sequence

### Step 1: Foundation

- install and configure the exact stack from `MASTER_PROMPT.md`
- implement Tailwind theme tokens, typography, motion primitives, and global layout rules
- replace placeholder router structure with the route model defined in the prompt
- add shared UI primitives and layout wrappers before page-specific components

### Step 2: Global shell

- build top navigation
- build page layout and split layout
- build the global agent trigger and agent panel frame
- wire screen-aware suggestion sets and agent message rendering with mocked actions

### Step 3: Core data model in the frontend

- define shared frontend types for molecules, proteins, jobs, results, agent messages, and batch entries
- implement Zustand stores for job state, draw state, agent state, and view state
- add TanStack Query mock adapters so future API hooks can swap data sources without UI rewrites

### Step 4: Core showcase screens

- landing page with hero, live metrics, feature grid, demo preview, and pricing
- input page with five tabs, RDKit validation hooks, protein source flows, upload mock flows, and batch setup
- draw page with canvas interactions, atom and bond controls, generated SMILES panel, and agent action stream
- docking lab with viewport shell, HUD, energy landscape, pipeline log, toolbar, controls, and tabbed result sidebar
- results page with pose ranking, interactions, ADMET, resistance, and export actions

### Step 5: Secondary screens

- dashboard with quick-launch, recent jobs, stats, AI task feed, and saved compounds
- report page with print-oriented AI report layout
- batch page with progress, leaderboard, filters, and scatter plot
- settings page with profile, API key, default settings, and saved proteins layout

### Step 6: Realism and state coverage

- ensure every screen has empty, loading, in-progress, success, and failure states
- ensure mocked job progress drives the docking lab and results transitions
- ensure the agent panel reflects screen-specific capabilities instead of generic chat

## Mocking rules

- mocked data must use the same shapes as planned production API contracts
- mocked job flows must emit the same event family names as planned WebSocket streams
- mocked artifacts should carry stable IDs and storage-like paths so links and exports look real
- never hardcode UI-only fields that would force backend-specific rewrites later

## Required hooks and libraries

- `useDockingJob` for mocked and later real job lifecycle
- `useAgentSession` for message state and agent event handling
- `useWebSocket` for typed subscription behavior
- `useRDKit` and `lib/rdkit.ts` for SMILES validation and SVG rendering
- lazy-loaded docking and draw routes because viewer and chemistry bundles are heavy

## Acceptance criteria

- all core routes are navigable and visually coherent
- the design system matches `MASTER_PROMPT.md`
- the docking lab feels like a real product, even with mocked compute
- the input and draw flows make data needs and state transitions obvious
- the results page can be reviewed as if it came from a real job
- engineers can begin backend replacement without redesigning page structure or state ownership

## Non-goals for this phase

- real docking compute
- production auth
- billing enforcement
- production observability
- enterprise deployment paths
