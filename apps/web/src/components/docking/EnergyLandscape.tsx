import type { PoseScore } from "../../stores/jobStore";

interface EnergyLandscapeProps {
  poses: PoseScore[];
  selectedPose: number;
  onSelect: (pose: number) => void;
}

function scoreClass(score: number) {
  if (score <= -9) return "score-excellent";
  if (score <= -7.5) return "score-good";
  if (score <= -6) return "score-moderate";
  return "score-weak";
}

export function EnergyLandscape({
  poses,
  selectedPose,
  onSelect,
}: EnergyLandscapeProps) {
  return (
    <div className="energy-landscape">
      {poses.length === 0 ? (
        <div className="energy-empty">Pose-by-pose energy bars appear here.</div>
      ) : (
        poses.map((pose) => (
          <button
            key={pose.pose_number}
            className={`energy-bar ${scoreClass(pose.score)} ${
              selectedPose === pose.pose_number ? "is-selected" : ""
            }`}
            style={{
              ["--bar-height" as string]: `${Math.min(
                100,
                Math.abs(pose.score) * 8,
              )}%`,
            }}
            type="button"
            onClick={() => onSelect(pose.pose_number)}
            title={`Pose ${pose.pose_number} · ${pose.score.toFixed(1)} kcal/mol`}
          >
            <span>{pose.pose_number}</span>
          </button>
        ))
      )}
    </div>
  );
}
