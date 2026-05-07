export type ScreenContext =
  | "landing"
  | "dashboard"
  | "input"
  | "draw"
  | "dock"
  | "results"
  | "report"
  | "batch"
  | "settings";

export interface MoleculeDescriptor {
  formula: string;
  mw: number;
  logp: number;
  hbd: number;
  hba: number;
  tpsa: number;
  qed: number;
  rotBonds: number;
  lipinskiPass: boolean;
  saScore: number;
}

export interface AdmetSummary {
  oralBioavailability: number;
  cyp3a4Inhibitor: number;
  hergRisk: number;
  bbbPenetration: number;
  solubility: number;
  ppb: number;
  diliRisk?: number;
  qed?: number;
}

export interface Molecule {
  id: string;
  name: string;
  smiles: string;
  inchi?: string;
  source: string;
  sourceId?: string;
  descriptor: MoleculeDescriptor;
  admet?: AdmetSummary;
  lastScore?: number;
}

export interface ProteinPocket {
  rank: number;
  volume: number;
  score: number;
  center: [number, number, number];
}

export interface ProteinQuality {
  completeness: number;
  missingResidues: number;
  ramachandranFavored: number;
  protonationPh: number;
  crystalWaters: number;
  alphafoldWarning?: string;
}

export interface Protein {
  id: string;
  name: string;
  source: string;
  pdbId?: string;
  uniprotId?: string;
  resolution?: number;
  residues: number;
  massKDa: number;
  quality: ProteinQuality;
  pockets: ProteinPocket[];
}

export interface Interaction {
  type: string;
  residue: string;
  distance: number;
  strength: "strong" | "medium" | "weak";
}

export interface DockingResult {
  id: string;
  poseRank: number;
  scoreKcalMol: number;
  rmsdLb: number;
  rmsdUb: number;
  estimatedKdNm: number;
  status: string;
  interactions: Interaction[];
  admet: AdmetSummary;
}

export interface ResistanceEntry {
  mutant: string;
  score: number;
  delta: number;
  status: string;
}

export interface BatchHit {
  rank: number;
  name: string;
  smiles: string;
  score: number;
  admet: number;
  purchase: string;
}

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  kind: "message" | "action";
  content: string;
}
