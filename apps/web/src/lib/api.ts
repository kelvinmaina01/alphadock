import { mockBatchHits, mockMolecule, mockProtein, mockRecentJobs, mockResults } from "./mocks";

export const apiBase = "/api/v1";

export async function getMeta(): Promise<{ name: string; api_version: string }> {
  return { name: "alphadock", api_version: "v1" };
}

export async function getMockDashboard() {
  return {
    recentJobs: mockRecentJobs,
    savedMolecule: mockMolecule,
  };
}

export async function getMockInputState() {
  return {
    molecule: mockMolecule,
    protein: mockProtein,
  };
}

export async function getMockResults() {
  return mockResults;
}

export async function getMockBatchHits() {
  return mockBatchHits;
}
