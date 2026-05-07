# AlphaDock Master Prompt

Hand this file to an engineer or AI coding assistant as the canonical frontend build brief for AlphaDock.

## Context

You are building the frontend for **AlphaDock**, an AI-native molecular docking platform that lets scientists run pharmaceutical-grade computational drug discovery in a browser with zero setup.

The aesthetic reference is **Codex by OpenAI** at the level of density, darkness, restraint, and tool-like seriousness. AlphaDock is not a coding tool, though. It has:

- live 3D molecular docking simulation
- real-time energy landscape updates via WebSocket
- AI agent chat on every screen with operational authority
- chemical draw canvas
- ADMET and resistance analysis surfaces
- batch virtual screening workflows

The Codex reference is purely aesthetic. AlphaDock remains a scientific workbench.

## Tech stack

Use this stack exactly:

```text
Framework:      React 18 + TypeScript (strict mode)
Build tool:     Vite 6
Routing:        React Router v6
Styling:        Tailwind CSS 3.4
State (server): TanStack Query v5
State (client): Zustand v5
3D viewer:      Mol* / pdbe-molstar
Chemistry:      @rdkit/rdkit
HTTP client:    Axios
WebSocket:      custom ws.ts manager
Charts:         Recharts
Animation:      Framer Motion
Icons:          Lucide React
PDF preview:    react-pdf
Testing:        Vitest + React Testing Library
E2E:            Playwright
Package mgr:    npm
```

## Design system

### Color tokens

```css
:root {
  --bg-base:     #03070f;
  --bg-surface:  #07101f;
  --bg-elevated: #0c1628;
  --bg-overlay:  #111f36;

  --border-subtle:  #1a2d4a;
  --border-default: #243b5e;
  --border-strong:  #2d4a72;

  --text-primary:   #ddeeff;
  --text-secondary: #7a9cc0;
  --text-muted:     #3d5a7a;
  --text-inverse:   #03070f;

  --accent:        #00cfff;
  --accent-dim:    rgba(0, 207, 255, 0.12);
  --accent-border: rgba(0, 207, 255, 0.25);

  --color-green:  #00e5a0;
  --color-amber:  #ffb84d;
  --color-red:    #ff4d6d;
  --color-purple: #a07de8;
  --color-teal:   #00c9b1;

  --mono-bg:   #040c18;
  --mono-text: #00cfff;

  --score-excellent: #00e5a0;
  --score-good:      #00cfff;
  --score-moderate:  #ffb84d;
  --score-weak:      #ff4d6d;
}
```

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

body {
  font-family: 'Space Grotesk', -apple-system, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-primary);
  background: var(--bg-base);
}

.mono {
  font-family: 'Space Mono', 'Courier New', monospace;
}
```

### Global texture

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,207,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,207,255,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}
```

### Component language

- dark only
- dense, professional, and tool-like
- no gradients on core UI elements
- minimal rounding
- borders for separation, not shadow-heavy surfaces
- monospace only where it carries meaning

## App structure

Use this structure as the frontend target:

```text
src/
├── app/
├── pages/
├── components/
│   ├── layout/
│   ├── agent/
│   ├── docking/
│   ├── molecule/
│   ├── protein/
│   ├── results/
│   ├── batch/
│   └── ui/
├── hooks/
├── stores/
├── lib/
├── types/
└── constants/
```

## Required routes

- `/`
- `/dashboard`
- `/input`
- `/draw`
- `/dock`
- `/results/:jobId`
- `/report/:jobId`
- `/batch/:batchId`
- `/settings`

## Page priorities

### Highest-fidelity pages

- landing
- dashboard quick-launch
- input
- draw
- docking lab
- results

### Functional-first pages

- report
- batch
- settings

## Core screen requirements

### Landing

- Codex-like hero density
- AlphaDock-specific messaging
- live metrics ticker
- feature grid
- docking lab preview
- pricing section

### Input

- five tabs
- SMILES validation with RDKit
- protein and target fetch flows
- upload flows
- batch setup flows
- agent trigger and screen-aware suggestions

### Draw

- atom and bond editing canvas
- ring templates
- generated SMILES
- real-time chemistry feedback
- agent action stream for draw operations

### Docking lab

- full-screen tool layout
- viewport toolbar
- Mol* area
- HUD overlay
- real-time energy landscape
- progress and pipeline log
- tabbed results sidebar
- agent slide-in panel

### Results

- stat cards
- ranked pose table
- interaction list
- ADMET and resistance surfaces
- export actions

## Global agent panel

The agent panel appears on every screen and must support:

- user messages
- AI messages
- action messages rendered in monospace
- screen-scoped suggestion chips
- typing and execution states

The tone is operational, not chatty consumer assistant UI.

## WebSocket model

Implement around these event families:

- `pose_evaluated`
- `step_complete`
- `job_done`
- `job_failed`
- `agent_typing`
- `tool_executing`
- `message_complete`
- `compound_screened`
- `hit_found`

## Stores

Implement at minimum:

- `jobStore`
- `agentStore`
- `drawStore`
- `viewStore`

Their state should align with `SYSTEM_CONTRACTS.md`.

## Performance constraints

- first contentful paint under 1.5s on a 4G-class connection
- time to interactive under 3s
- heavy routes lazy-loaded
- Mol* and RDKit loaded only where needed
- initial bundle kept lean

## What not to build

- no light mode
- no decorative animations
- no card soup
- no consumer-style gradient UI
- no excessive modals
- no fake marketing copy inside the authenticated app

## Aesthetic sentence

Imagine a Bloomberg Terminal designed by the team that built Linear, running molecular docking software used by top drug discovery scientists.

Dark. Dense. Precise. Fast. Confident.

## Relationship to the rest of the spec pack

- `MASTER_ROADMAP.md` defines when this prompt is executed
- `FRONTEND_PHASE_PLAN.md` defines how this prompt is staged
- `SYSTEM_CONTRACTS.md` defines the data and event shapes behind it
- `SCIENTIFIC_CORE_PHASE.md` defines how mocked behaviors get replaced by real services
