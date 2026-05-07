import type { Interaction } from "../../types/chemistry";

interface InteractionListProps {
  interactions: Interaction[];
}

export function InteractionList({ interactions }: InteractionListProps) {
  return (
    <div className="table-card">
      <div className="table-head">
        <span>Type</span>
        <span>Residue</span>
        <span>Distance</span>
        <span>Strength</span>
      </div>
      {interactions.map((interaction) => (
        <div key={`${interaction.type}-${interaction.residue}`} className="table-row static">
          <span>{interaction.type}</span>
          <span>{interaction.residue}</span>
          <span>{interaction.distance.toFixed(1)} Å</span>
          <span>{interaction.strength}</span>
        </div>
      ))}
    </div>
  );
}
