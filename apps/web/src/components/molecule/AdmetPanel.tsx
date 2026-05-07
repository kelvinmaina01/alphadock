import type { AdmetSummary } from "../../types/chemistry";

interface AdmetPanelProps {
  admet: AdmetSummary;
}

export function AdmetPanel({ admet }: AdmetPanelProps) {
  const rows = [
    ["Oral bioavailability", admet.oralBioavailability],
    ["CYP3A4 inhibitor", admet.cyp3a4Inhibitor],
    ["hERG risk", admet.hergRisk],
    ["BBB penetration", admet.bbbPenetration],
    ["Solubility", admet.solubility],
    ["PPB", admet.ppb],
  ] as const;

  return (
    <div className="data-card">
      <p className="eyebrow">ADMET quick check</p>
      <div className="bar-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="metric-row">
              <span>{label}</span>
              <strong>{Math.round(value * 100)}%</strong>
            </div>
            <div className="mini-bar">
              <span style={{ width: `${Math.round(value * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
