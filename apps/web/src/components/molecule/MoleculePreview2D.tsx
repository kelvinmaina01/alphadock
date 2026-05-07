import type { Molecule } from "../../types/chemistry";

interface MoleculePreview2DProps {
  molecule: Molecule;
}

export function MoleculePreview2D({ molecule }: MoleculePreview2DProps) {
  return (
    <div className="preview-card">
      <p className="eyebrow">2D preview</p>
      <div className="molecule-preview">
        <div className="ring ring-a" />
        <div className="ring ring-b" />
        <div className="chain" />
      </div>
      <p className="mono-block">{molecule.smiles}</p>
    </div>
  );
}
