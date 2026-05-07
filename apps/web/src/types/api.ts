import type { BatchHit, DockingResult, Molecule, Protein } from "./chemistry";

export interface HealthResponse {
  status: string;
  service: string;
}

export interface ApiMetaResponse {
  name: string;
  api_version: string;
}

export interface DashboardResponse {
  recentJobs: Array<{
    id: string;
    molecule: string;
    target: string;
    score: number;
    engine: string;
    status: string;
    time: string;
  }>;
  savedMolecule: Molecule;
}

export interface InputStateResponse {
  molecule: Molecule;
  protein: Protein;
}

export type ResultsResponse = DockingResult[];
export type BatchHitsResponse = BatchHit[];
