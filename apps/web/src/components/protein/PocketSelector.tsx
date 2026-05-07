import type { ProteinPocket } from "../../types/chemistry";

interface PocketSelectorProps {
  pockets: ProteinPocket[];
}

export function PocketSelector({ pockets }: PocketSelectorProps) {
  return (
    <div className="data-card">
      <p className="eyebrow">Detected pockets</p>
      <div className="metric-list">
        {pockets.map((pocket) => (
          <div key={pocket.rank} className="metric-row">
            <span>
              Pocket {pocket.rank} · {pocket.volume} Å³
            </span>
            <strong>{pocket.score.toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
