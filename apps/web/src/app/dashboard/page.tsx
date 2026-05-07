import { Link as RouterLink } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { mockActivityFeed, mockRecentJobs } from "../../lib/mocks";

const Link = RouterLink as unknown as (props: LinkProps) => JSX.Element;

export function DashboardPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, Kimani.</h1>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <p className="eyebrow">Quick launch</p>
          <div className="quick-launch">
            <input className="field mono" value="Imatinib" readOnly />
            <input className="field mono" value="1IEP" readOnly />
            <button className="primary-button" type="button">
              Run docking
            </button>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Molecule</span>
              <span>Target</span>
              <span>Score</span>
              <span>Engine</span>
              <span>Status</span>
            </div>
            {mockRecentJobs.map((job) => (
              <Link key={job.id} className="table-row" to={`/results/${job.id}`}>
                <span>{job.molecule}</span>
                <span>{job.target}</span>
                <strong className="mono">{job.score.toFixed(1)}</strong>
                <span>{job.engine}</span>
                <span>{job.status}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="stack">
          <div className="stat-grid">
            <article className="panel stat-card">
              <span>Jobs run</span>
              <strong>384</strong>
            </article>
            <article className="panel stat-card">
              <span>Best score ever</span>
              <strong className="text-green">-11.2</strong>
            </article>
            <article className="panel stat-card">
              <span>Compounds screened</span>
              <strong>28.4k</strong>
            </article>
            <article className="panel stat-card">
              <span>Hours saved</span>
              <strong>47</strong>
            </article>
          </div>
          <div className="panel">
            <p className="eyebrow">AI task feed</p>
            <div className="mono-feed">
              {mockActivityFeed.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
