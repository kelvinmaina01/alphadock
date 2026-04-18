/** TanStack Query + WebSocket for job state — AlphaDock_Repo_Guide §1.2 */
export function useDockingJob() {
  return { job: null as string | null, status: "idle" as const };
}
