import { useViewStore } from "../../stores/viewStore";

const modes = ["surface", "stick", "sphere", "ribbon", "cartoon"] as const;

export function ViewportToolbar() {
  const {
    mode,
    showWater,
    showHbonds,
    showHydrophobic,
    showElectrostatic,
    setMode,
    toggleWater,
    toggleHbonds,
    toggleHydrophobic,
    toggleElectrostatic,
  } = useViewStore();

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        {modes.map((item) => (
          <button
            key={item}
            className={`toolbar-pill ${mode === item ? "is-active" : ""}`}
            type="button"
            onClick={() => setMode(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="toolbar-group">
        <button
          className={`toolbar-pill ${showWater ? "is-active" : ""}`}
          type="button"
          onClick={toggleWater}
        >
          Water
        </button>
        <button
          className={`toolbar-pill ${showHbonds ? "is-active" : ""}`}
          type="button"
          onClick={toggleHbonds}
        >
          H-bonds
        </button>
        <button
          className={`toolbar-pill ${showHydrophobic ? "is-active" : ""}`}
          type="button"
          onClick={toggleHydrophobic}
        >
          Hydrophobic
        </button>
        <button
          className={`toolbar-pill ${showElectrostatic ? "is-active" : ""}`}
          type="button"
          onClick={toggleElectrostatic}
        >
          Electrostatic
        </button>
      </div>
    </div>
  );
}
