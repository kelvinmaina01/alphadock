import { useDrawStore } from "../../stores/drawStore";

export function DrawCanvas() {
  const { atoms, bonds, selectedAtom, selectAtom } = useDrawStore();

  return (
    <div className="draw-canvas">
      <div className="canvas-grid" />
      <svg viewBox="0 0 640 420" className="canvas-svg" role="img" aria-label="Draw canvas">
        {bonds.map((bond) => {
          const atom1 = atoms.find((atom) => atom.id === bond.atom1);
          const atom2 = atoms.find((atom) => atom.id === bond.atom2);
          if (!atom1 || !atom2) return null;
          return (
            <line
              key={bond.id}
              x1={atom1.x}
              y1={atom1.y}
              x2={atom2.x}
              y2={atom2.y}
              className={`bond-line bond-${bond.type}`}
            />
          );
        })}
        {atoms.map((atom) => (
          <g key={atom.id} onClick={() => selectAtom(atom.id)}>
            <circle
              cx={atom.x}
              cy={atom.y}
              r={selectedAtom === atom.id ? 24 : 18}
              className={selectedAtom === atom.id ? "atom-shell selected" : "atom-shell"}
            />
            <text x={atom.x} y={atom.y + 5} textAnchor="middle" className="atom-label">
              {atom.element}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
