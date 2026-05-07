import type { BatchHit } from "../../types/chemistry";

interface ScatterPlotProps {
  hits: BatchHit[];
}

export function ScatterPlot({ hits }: ScatterPlotProps) {
  return (
    <div className="panel scatter-shell">
      <p className="eyebrow">Score vs ADMET</p>
      <div className="scatter-placeholder">
        {hits.map((hit) => (
          <span
            key={hit.rank}
            style={{
              left: `${60 + hit.rank * 18}px`,
              bottom: `${40 + hit.admet * 180}px`,
            }}
            title={`${hit.name} · ${hit.score.toFixed(1)} kcal/mol`}
          />
        ))}
      </div>
    </div>
  );
}
