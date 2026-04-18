import { useParams } from "react-router-dom";

export function ReportPage() {
  const { jobId } = useParams();
  return (
    <section className="ad-page">
      <h1>AI report</h1>
      <p className="lede">Job ID: {jobId}</p>
    </section>
  );
}
