import type { DockingResult } from "../../types/chemistry";

interface PoseRankTableProps {
  results: DockingResult[];
  selectedPose: number;
  onSelect: (rank: number) => void;
}

export function PoseRankTable({
  results,
  selectedPose,
  onSelect,
}: PoseRankTableProps) {
  return (
    <div className="table-card">
      <div className="table-head">
        <span>Rank</span>
        <span>Score</span>
        <span>RMSD</span>
        <span>Status</span>
      </div>
      {results.map((result) => (
        <button
          key={result.id}
          className={`table-row ${selectedPose === result.poseRank ? "is-selected" : ""}`}
          type="button"
          onClick={() => onSelect(result.poseRank)}
        >
          <span>{result.poseRank}</span>
          <strong className="mono">{result.scoreKcalMol.toFixed(1)} kcal/mol</strong>
          <span>
            {result.rmsdLb.toFixed(1)} / {result.rmsdUb.toFixed(1)} Å
          </span>
          <span>{result.status}</span>
        </button>
      ))}
    </div>
  );
}
