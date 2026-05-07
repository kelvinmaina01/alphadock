import { create } from "zustand";
import { mockResults } from "../lib/mocks";

export interface PoseScore {
  pose_number: number;
  score: number;
  rmsd_lb: number;
  rmsd_ub: number;
  kd_nM: number;
}

type JobStatus = "idle" | "pending" | "running" | "done" | "failed" | "cancelled";

type JobStore = {
  jobId: string | null;
  status: JobStatus;
  poseScores: PoseScore[];
  selectedPose: number;
  bestScore: number | null;
  elapsed: number;
  currentStep: string;
  logLines: string[];
  setJobId: (id: string | null) => void;
  selectPose: (rank: number) => void;
  startMockRun: () => void;
  stopMockRun: () => void;
  reset: () => void;
};

let timerId: number | null = null;

const scoreQueue: PoseScore[] = mockResults.map((result) => ({
  pose_number: result.poseRank,
  score: result.scoreKcalMol,
  rmsd_lb: result.rmsdLb,
  rmsd_ub: result.rmsdUb,
  kd_nM: result.estimatedKdNm,
}));

export const useJobStore = create<JobStore>((set) => ({
  jobId: "job-abl-imatinib",
  status: "idle",
  poseScores: [],
  selectedPose: 1,
  bestScore: null,
  elapsed: 0,
  currentStep: "Ready",
  logLines: [
    "[09:34:12] AlphaDock UI initialized",
    "[09:34:12] Ready for mocked docking session",
  ],
  setJobId: (jobId) => set({ jobId }),
  selectPose: (selectedPose) => set({ selectedPose }),
  startMockRun: () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
    }

    set({
      status: "running",
      poseScores: [],
      bestScore: null,
      elapsed: 0,
      selectedPose: 1,
      currentStep: "Searching poses",
      logLines: [
        "[09:34:12] AlphaDock job started -> Vina",
        "[09:34:13] BCR-ABL · 1IEP · Imatinib",
        "[09:34:13] Protein loaded from cache",
        "[09:34:13] Ligand prepared (Meeko PDBQT)",
        "[09:34:14] Searching... exhaustiveness=16",
      ],
    });

    let index = 0;
    timerId = window.setInterval(() => {
      const next = scoreQueue[index];
      if (!next) {
        if (timerId !== null) {
          window.clearInterval(timerId);
          timerId = null;
        }
        set((state) => ({
          status: "done",
          currentStep: "Completed",
          logLines: [
            ...state.logLines,
            `[09:34:47] Done -> Best: ${state.bestScore?.toFixed(1) ?? "-9.8"} kcal/mol`,
          ],
        }));
        return;
      }

      set((state) => ({
        poseScores: [...state.poseScores, next],
        elapsed: state.elapsed + 4.2,
        bestScore:
          state.bestScore === null ? next.score : Math.min(state.bestScore, next.score),
        logLines: [
          ...state.logLines,
          `[09:34:${20 + index}] Pose ${next.pose_number}: ${next.score.toFixed(1)} kcal/mol`,
        ],
      }));
      index += 1;
    }, 900);
  },
  stopMockRun: () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    set((state) => ({
      status: "cancelled",
      currentStep: "Cancelled",
      logLines: [...state.logLines, "[09:34:31] Job cancelled by user"],
    }));
  },
  reset: () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
    set({
      status: "idle",
      poseScores: [],
      selectedPose: 1,
      bestScore: null,
      elapsed: 0,
      currentStep: "Ready",
      logLines: [
        "[09:34:12] AlphaDock UI initialized",
        "[09:34:12] Ready for mocked docking session",
      ],
    });
  },
}));
