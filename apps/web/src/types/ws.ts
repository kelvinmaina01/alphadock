export type WSEvent =
  | {
      event: "pose_evaluated";
      data: {
        pose_number: number;
        score: number;
        rmsd_lb: number;
        rmsd_ub: number;
        kd_nM: number;
      };
    }
  | { event: "step_complete"; data: { step: string; duration: number } }
  | {
      event: "job_done";
      data: { best_score: number; best_pose_rank: number; num_interactions: number };
    }
  | { event: "job_failed"; data: { error: string; step: string } }
  | { event: "agent_typing"; data: Record<string, never> }
  | { event: "tool_executing"; data: { tool: string; args: Record<string, unknown> } }
  | { event: "message_complete"; data: { content: string; tool_calls: unknown[] } }
  | {
      event: "compound_screened";
      data: { done: number; total: number; best_score_so_far: number };
    }
  | { event: "hit_found"; data: { smiles: string; name: string; score: number } };
