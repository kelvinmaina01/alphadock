interface MolstarViewerProps {
  bestScore: number | null;
  selectedPose: number;
}

export function MolstarViewer({ bestScore, selectedPose }: MolstarViewerProps) {
  return (
    <div className="molstar-shell">
      <div className="viewport-grid" />
      <div className="protein-blob protein-a" />
      <div className="protein-blob protein-b" />
      <div className="ligand-cluster">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="molstar-label">
        <p className="eyebrow">Mock Mol*</p>
        <h3>BCR-ABL kinase · pose {selectedPose}</h3>
        <p>
          {bestScore === null
            ? "Queued for docking"
            : `Best mocked score ${bestScore.toFixed(1)} kcal/mol`}
        </p>
      </div>
    </div>
  );
}
