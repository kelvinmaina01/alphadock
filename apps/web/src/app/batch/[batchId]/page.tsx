import { useParams } from "react-router-dom";

export function BatchPage() {
  const { batchId } = useParams();
  return (
    <section className="ad-page">
      <h1>Batch screen</h1>
      <p className="lede">Batch ID: {batchId}</p>
    </section>
  );
}
