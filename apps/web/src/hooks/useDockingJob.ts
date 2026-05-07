import { useJobStore } from "../stores/jobStore";

export function useDockingJob() {
  const store = useJobStore();

  return {
    jobId: store.jobId,
    status: store.status,
    poseScores: store.poseScores,
    selectedPose: store.selectedPose,
    bestScore: store.bestScore,
    elapsed: store.elapsed,
    currentStep: store.currentStep,
    logLines: store.logLines,
    start: store.startMockRun,
    stop: store.stopMockRun,
    selectPose: store.selectPose,
    reset: store.reset,
  };
}
