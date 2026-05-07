import { useParams } from "react-router-dom";
import { BatchProgress } from "../../../components/batch/BatchProgress";
import { ScatterPlot } from "../../../components/batch/ScatterPlot";
import { mockBatchHits } from "../../../lib/mocks";

export function BatchPage() {
  const { batchId } = useParams();

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Batch results</p>
          <h1>FDA approved screening · {batchId}</h1>
        </div>
      </div>

      <BatchProgress done={1450} total={2340} hits={58} eta="7 min" />

      <div className="two-column">
        <div className="table-card">
          <div className="table-head">
            <span>Rank</span>
            <span>Molecule</span>
            <span>Score</span>
            <span>ADMET</span>
          </div>
          {mockBatchHits.map((hit) => (
            <div key={hit.rank} className="table-row static">
              <span>{hit.rank}</span>
              <span>{hit.name}</span>
              <strong className="mono">{hit.score.toFixed(1)}</strong>
              <span>{Math.round(hit.admet * 100)}%</span>
            </div>
          ))}
        </div>
        <ScatterPlot hits={mockBatchHits} />
      </div>
    </section>
  );
}
