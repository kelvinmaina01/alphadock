interface BatchProgressProps {
  done: number;
  total: number;
  hits: number;
  eta: string;
}

export function BatchProgress({ done, total, hits, eta }: BatchProgressProps) {
  const percent = Math.round((done / total) * 100);

  return (
    <div className="panel">
      <p className="eyebrow">Progress</p>
      <div className="dock-progress-track">
        <div className="dock-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="inline-note">
        {done} / {total} screened · {hits} hits · ~{eta} remaining
      </p>
    </div>
  );
}
