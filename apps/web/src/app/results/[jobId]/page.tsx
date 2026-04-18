import { useParams } from "react-router-dom";

export function ResultsPage() {
  const { jobId } = useParams();
  return (
    <section className="ad-page">
      <h1>Results</h1>
      <p className="lede">Job ID: {jobId}</p>
    </section>
  );
}
