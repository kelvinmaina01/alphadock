import type { MoleculeDescriptor } from "../../types/chemistry";

interface LipinskiPanelProps {
  descriptor: MoleculeDescriptor;
}

export function LipinskiPanel({ descriptor }: LipinskiPanelProps) {
  const items = [
    ["MW ≤ 500", `${descriptor.mw} Da`, descriptor.mw <= 500],
    ["logP ≤ 5", descriptor.logp.toFixed(1), descriptor.logp <= 5],
    ["H-bond donors ≤ 5", `${descriptor.hbd}`, descriptor.hbd <= 5],
    ["H-bond acceptors ≤ 10", `${descriptor.hba}`, descriptor.hba <= 10],
    ["Rotatable bonds", `${descriptor.rotBonds}`, descriptor.rotBonds <= 10],
  ] as const;

  return (
    <div className="data-card">
      <p className="eyebrow">Lipinski</p>
      <div className="metric-list">
        {items.map(([label, value, pass]) => (
          <div key={label} className="metric-row">
            <span>{label}</span>
            <strong className={pass ? "text-green" : "text-amber"}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
