import type { ProteinQuality } from "../../types/chemistry";

interface QualityReportProps {
  quality: ProteinQuality;
}

export function QualityReport({ quality }: QualityReportProps) {
  return (
    <div className="data-card">
      <p className="eyebrow">Structure quality</p>
      <div className="metric-list">
        <div className="metric-row">
          <span>Completeness</span>
          <strong>{quality.completeness}%</strong>
        </div>
        <div className="metric-row">
          <span>Missing residues</span>
          <strong>{quality.missingResidues}</strong>
        </div>
        <div className="metric-row">
          <span>Ramachandran favored</span>
          <strong>{quality.ramachandranFavored}%</strong>
        </div>
        <div className="metric-row">
          <span>Protonation</span>
          <strong>pH {quality.protonationPh}</strong>
        </div>
      </div>
    </div>
  );
}
