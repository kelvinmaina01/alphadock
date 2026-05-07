interface PipelineLogProps {
  lines: string[];
}

export function PipelineLog({ lines }: PipelineLogProps) {
  return (
    <div className="pipeline-log">
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}
