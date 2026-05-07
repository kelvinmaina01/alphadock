interface DockingControlsProps {
  status: string;
  step: string;
  elapsed: number;
  onRun: () => void;
  onStop: () => void;
}

export function DockingControls({
  status,
  step,
  elapsed,
  onRun,
  onStop,
}: DockingControlsProps) {
  return (
    <div className="dock-controls">
      <div className="dock-progress">
        <div className="dock-progress-track">
          <div
            className="dock-progress-fill"
            style={{
              width:
                status === "running"
                  ? `${Math.min(95, Math.max(12, elapsed * 4))}%`
                  : status === "done"
                    ? "100%"
                    : "0%",
            }}
          />
        </div>
        <div className="dock-progress-meta">
          <span>{step}</span>
          <span>{elapsed.toFixed(1)}s</span>
        </div>
      </div>
      <div className="dock-actions">
        {status === "running" ? (
          <button className="danger-button" type="button" onClick={onStop}>
            Stop
          </button>
        ) : (
          <button className="primary-button" type="button" onClick={onRun}>
            Run docking
          </button>
        )}
      </div>
    </div>
  );
}
