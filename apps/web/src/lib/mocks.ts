import type {
  AdmetSummary,
  AgentMessage,
  BatchHit,
  DockingResult,
  Molecule,
  MoleculeDescriptor,
  Protein,
  ProteinPocket,
  ResistanceEntry,
} from "../types/chemistry";

export const defaultSmiles =
  "CC1=CC=C(C=C1)NC2=NC=CC(=N2)NC3=CC(=C(C=C3)CN4CCN(CC4)C)OC";

export const mockDescriptor: MoleculeDescriptor = {
  formula: "C29H31N7O",
  mw: 493.6,
  logp: 3.1,
  hbd: 4,
  hba: 8,
  tpsa: 111,
  qed: 0.72,
  rotBonds: 7,
  lipinskiPass: true,
  saScore: 1.2,
};

export const mockMolecule: Molecule = {
  id: "mol-imatinib",
  name: "Imatinib",
  smiles: defaultSmiles,
  inchi: "InChI=1S/C29H31N7O/c1-36-14-12-35(13-15-36)18-21-8-9-27(38-3)24(16-21)33-29-31-11-10-25(32-29)34-23-7-5-20(2)6-22(23)17-19-4-1-2-3-19/h1-11,16-18H,12-15H2,2H3,(H2,31,32,33,34)",
  source: "pubchem",
  sourceId: "5291",
  descriptor: mockDescriptor,
  admet: {
    oralBioavailability: 0.98,
    cyp3a4Inhibitor: 0.71,
    hergRisk: 0.18,
    bbbPenetration: 0.22,
    solubility: 0.61,
    ppb: 0.84,
  },
  lastScore: -9.8,
};

export const mockPockets: ProteinPocket[] = [
  { rank: 1, volume: 892, score: 0.91, center: [12.3, -4.8, 28.7] },
  { rank: 2, volume: 310, score: 0.62, center: [8.1, -1.2, 25.0] },
  { rank: 3, volume: 188, score: 0.41, center: [3.0, 4.6, 19.2] },
];

export const mockProtein: Protein = {
  id: "prot-1iep",
  name: "BCR-ABL kinase",
  pdbId: "1IEP",
  uniprotId: "P00519",
  source: "pdb",
  resolution: 2.1,
  residues: 302,
  massKDa: 34.2,
  quality: {
    completeness: 97.3,
    missingResidues: 8,
    ramachandranFavored: 96.1,
    protonationPh: 7.4,
    crystalWaters: 142,
    alphafoldWarning:
      "AlphaFold models are apo-like. Flexible regions with low pLDDT should be treated as uncertain docking context.",
  },
  pockets: mockPockets,
};

export const mockInteractions: DockingResult["interactions"] = [
  { type: "H-bond", residue: "Asp381", distance: 2.1, strength: "strong" },
  {
    type: "Salt bridge",
    residue: "Glu286",
    distance: 3.2,
    strength: "strong",
  },
  { type: "pi-stack", residue: "Tyr253", distance: 3.8, strength: "medium" },
  {
    type: "Hydrophobic",
    residue: "Leu370",
    distance: 3.9,
    strength: "medium",
  },
];

export const mockResistance: ResistanceEntry[] = [
  { mutant: "T315I", score: -5.1, delta: -4.7, status: "Resistant" },
  { mutant: "E255K", score: -6.8, delta: -3.0, status: "Moderate" },
  { mutant: "M351T", score: -8.9, delta: 0.9, status: "Maintained" },
];

export const mockAdmetSummary: AdmetSummary = {
  oralBioavailability: 0.98,
  cyp3a4Inhibitor: 0.71,
  hergRisk: 0.18,
  bbbPenetration: 0.22,
  solubility: 0.61,
  ppb: 0.84,
  diliRisk: 0.24,
  qed: 0.72,
};

export const mockResults: DockingResult[] = [
  {
    id: "pose-1",
    poseRank: 1,
    scoreKcalMol: -9.8,
    rmsdLb: 1.1,
    rmsdUb: 1.9,
    estimatedKdNm: 2.1,
    status: "Best pose",
    interactions: mockInteractions,
    admet: mockAdmetSummary,
  },
  {
    id: "pose-2",
    poseRank: 2,
    scoreKcalMol: -8.9,
    rmsdLb: 1.7,
    rmsdUb: 2.4,
    estimatedKdNm: 6.3,
    status: "Stable",
    interactions: mockInteractions.slice(0, 3),
    admet: mockAdmetSummary,
  },
  {
    id: "pose-3",
    poseRank: 3,
    scoreKcalMol: -8.2,
    rmsdLb: 2.2,
    rmsdUb: 2.9,
    estimatedKdNm: 15.8,
    status: "Viable",
    interactions: mockInteractions.slice(0, 2),
    admet: mockAdmetSummary,
  },
  {
    id: "pose-4",
    poseRank: 4,
    scoreKcalMol: -7.8,
    rmsdLb: 2.6,
    rmsdUb: 3.3,
    estimatedKdNm: 28.0,
    status: "Viable",
    interactions: mockInteractions.slice(0, 2),
    admet: mockAdmetSummary,
  },
  {
    id: "pose-5",
    poseRank: 5,
    scoreKcalMol: -7.1,
    rmsdLb: 2.9,
    rmsdUb: 4.2,
    estimatedKdNm: 71.0,
    status: "Borderline",
    interactions: mockInteractions.slice(0, 1),
    admet: mockAdmetSummary,
  },
];

export const mockBatchHits: BatchHit[] = [
  {
    rank: 1,
    name: "Cpd_0147",
    smiles: "c1ccncc1NC(=O)C",
    score: -10.2,
    admet: 0.84,
    purchase: "Buy (ZINC)",
  },
  {
    rank: 2,
    name: "Imatinib",
    smiles: defaultSmiles,
    score: -9.8,
    admet: 0.72,
    purchase: "Approved",
  },
  {
    rank: 3,
    name: "Cpd_0891",
    smiles: "O=C(Nc1ccc(F)cc1)n1ccnc1",
    score: -9.6,
    admet: 0.79,
    purchase: "Buy (ZINC)",
  },
];

export const agentSuggestions: Record<string, string[]> = {
  landing: [
    "Show live docking lab",
    "Why web-first for AlphaDock?",
    "What makes this cheaper than Schrödinger?",
  ],
  dashboard: ["Load imatinib", "Queue BCR-ABL job", "Show recent hits"],
  input: ["Load imatinib", "Fetch 1IEP", "Check ADMET", "Find BCR-ABL hits"],
  draw: [
    "Draw benzene ring",
    "Add piperazine",
    "Build imatinib scaffold",
    "Clear canvas",
  ],
  dock: ["Run docking", "Show surface view", "Toggle waters", "Explain score"],
  results: [
    "Explain score",
    "Generate report",
    "Screen T315I",
    "Suggest analogue",
  ],
  report: ["Generate PDF", "Explain DFG-out", "Clinical context"],
  batch: ["Filter top hits", "Find best ADMET", "Export top 50"],
  settings: ["Set default engine", "Review API keys"],
};

export function createIntroMessages(screen: string): AgentMessage[] {
  return [
    {
      id: `intro-${screen}`,
      role: "assistant",
      kind: "message",
      content:
        "I can help with molecule search, docking setup, screen-specific actions, and interpreting results. Tell me what you want to run.",
    },
  ];
}

export const mockActivityFeed = [
  "[12:34] Loaded imatinib from PubChem -> 1IEP",
  "[11:52] Batch: FDA library 2,340 compounds queued",
  "[09:17] T315I resistance panel completed",
];

export const mockRecentJobs = [
  {
    id: "job-abl-imatinib",
    molecule: "Imatinib",
    target: "BCR-ABL",
    score: -9.8,
    engine: "Vina",
    status: "Done",
    time: "2 min ago",
  },
  {
    id: "job-egfr-erlotinib",
    molecule: "Erlotinib",
    target: "EGFR",
    score: -8.7,
    engine: "Vina",
    status: "Running",
    time: "7 min ago",
  },
  {
    id: "job-mpro-nirm",
    molecule: "Nirmatrelvir",
    target: "Mpro",
    score: -7.4,
    engine: "GNINA",
    status: "Queued",
    time: "12 min ago",
  },
];
