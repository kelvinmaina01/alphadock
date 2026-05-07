import type { ResistanceEntry } from "../../types/chemistry";

interface ResistanceTableProps {
  rows: ResistanceEntry[];
}

export function ResistanceTable({ rows }: ResistanceTableProps) {
  return (
    <div className="table-card">
      <div className="table-head">
        <span>Mutation</span>
        <span>Score</span>
        <span>Delta</span>
        <span>Status</span>
      </div>
      {rows.map((row) => (
        <div key={row.mutant} className="table-row static">
          <span>{row.mutant}</span>
          <strong className="mono">{row.score.toFixed(1)}</strong>
          <span>{row.delta.toFixed(1)}</span>
          <span>{row.status}</span>
        </div>
      ))}
    </div>
  );
}
