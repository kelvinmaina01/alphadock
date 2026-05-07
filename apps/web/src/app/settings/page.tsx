export function SettingsPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Profile, defaults, and API preferences.</h1>
        </div>
      </div>

      <div className="two-column">
        <div className="panel">
          <p className="eyebrow">Profile</p>
          <div className="stack tight">
            <input className="field" value="Kimani K." readOnly />
            <input className="field" value="University lab account" readOnly />
            <input className="field" value="Computational chemistry" readOnly />
          </div>
        </div>
        <div className="panel">
          <p className="eyebrow">Defaults</p>
          <div className="metric-list">
            <div className="metric-row">
              <span>Preferred engine</span>
              <strong>Vina</strong>
            </div>
            <div className="metric-row">
              <span>Exhaustiveness</span>
              <strong>16</strong>
            </div>
            <div className="metric-row">
              <span>Always-on ADMET</span>
              <strong>Enabled</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
