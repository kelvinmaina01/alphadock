import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { HealthResponse } from "../../types/api";

export function LandingPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/health")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Unknown error"),
      );
  }, []);

  return (
    <section className="ad-page">
      <header className="hero">
        <p className="eyebrow">AlphaDock</p>
        <h1>Landing</h1>
        <p className="lede">
          UI routes and file tree follow <strong>AlphaDock_Repo_Guide</strong>{" "}
          §1.2; behaviour and integrations follow the three specification
          documents at the repository root.
        </p>
        <p>
          <Link to="/input">Start docking →</Link>
        </p>
      </header>

      <section className="panel">
        <h2>Dev check</h2>
        {health && (
          <p className="ok">
            API: {health.service} — {health.status}
          </p>
        )}
        {error && (
          <p className="err">
            API not reachable ({error}). Start FastAPI on port 8000.
          </p>
        )}
      </section>
    </section>
  );
}
