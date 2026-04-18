import { create } from "zustand";

type JobState = { jobId: string | null; setJobId: (id: string | null) => void };

export const useJobStore = create<JobState>((set) => ({
  jobId: null,
  setJobId: (jobId) => set({ jobId }),
}));
