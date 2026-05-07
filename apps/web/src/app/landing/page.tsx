import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "◈",
    color: "var(--ac)",
    title: "Live 3D simulation",
    desc: "Watch every pose evaluated in real time. Drag, rotate, inspect binding contacts as they form.",
  },
  {
    icon: "⬡",
    color: "var(--pu2)",
    title: "Any molecule input",
    desc: "Paste SMILES, draw structures, upload SDF files, batch screen thousands, or search PubChem/ChEMBL.",
  },
  {
    icon: "◎",
    color: "var(--gr)",
    title: "AI agent on every screen",
    desc: "Your AI co-scientist can draw molecules, run docking, interpret results, generate reports, and suggest next steps via chat.",
  },
  {
    icon: "◑",
    color: "var(--am)",
    title: "Integrated ADMET",
    desc: "Binding score plus pharmacokinetics in one view. No more switching between disconnected tools.",
  },
  {
    icon: "◌",
    color: "var(--tl)",
    title: "Resistance panels",
    desc: "Auto-dock against T315I, E255K, and other known resistance mutants. Catch failures before synthesis.",
  },
  {
    icon: "◇",
    color: "var(--rd)",
    title: "Custom proteins",
    desc: "Upload your own PDB, use AlphaFold via UniProt, or predict from amino acid sequence. Any target.",
  },
] as const;

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="landing-screen">
      <div className="land-hero">
        <div className="land-eyebrow">Introducing AlphaDock</div>
        <div className="land-title">
          Drug discovery
          <br />
          belongs to <span className="c1">everyone</span>
          <br />
          not just <span className="c2">Big Pharma</span>
        </div>
        <div className="land-sub">
          The world&apos;s first AI-native molecular docking platform. Paste a
          molecule, watch it dock live, get an AI explanation — zero setup, zero
          PhD required.
        </div>
        <div className="land-btns">
          <button className="btn-hero btn-hero-p" type="button" onClick={() => navigate("/input")}>
            Start docking →
          </button>
          <button className="btn-hero btn-hero-s" type="button" onClick={() => navigate("/dock")}>
            Watch live simulation
          </button>
        </div>

        <div className="land-stats">
          <div className="lstat">
            <div className="lstat-v" style={{ color: "var(--rd)" }}>
              $2.8B
            </div>
            <div className="lstat-l">avg cost per drug</div>
          </div>
          <div className="lstat">
            <div className="lstat-v" style={{ color: "var(--am)" }}>
              17 yrs
            </div>
            <div className="lstat-l">avg timeline</div>
          </div>
          <div className="lstat">
            <div className="lstat-v" style={{ color: "var(--mut)" }}>
              90%
            </div>
            <div className="lstat-l">proteome undrugged</div>
          </div>
          <div className="lstat">
            <div className="lstat-v" style={{ color: "var(--gr)" }}>
              $0
            </div>
            <div className="lstat-l">cost to use AlphaDock</div>
          </div>
          <div className="lstat">
            <div className="lstat-v" style={{ color: "var(--ac)" }}>
              minutes
            </div>
            <div className="lstat-l">molecule to insight</div>
          </div>
        </div>

        <div className="land-3col">
          <div className="l3">
            <div className="l3-lbl problem">▲ The problem</div>
            <div className="l3-txt">
              Molecular docking — finding which compounds bind to a disease target —
              requires expensive software, command-line expertise, and weeks of
              setup. 90% of drug targets remain unexplored because of this barrier.
            </div>
          </div>
          <div className="l3">
            <div className="l3-lbl solution">✓ The solution</div>
            <div className="l3-txt">
              AlphaDock wraps AutoDock Vina, GNINA, and DiffDock in a live 3D
              interface with an AI agent that explains every result, suggests
              modifications, draws molecules on command, and runs batch screens
              autonomously.
            </div>
          </div>
          <div className="l3">
            <div className="l3-lbl impact">✦ The impact</div>
            <div className="l3-txt">
              A biologist in Nairobi, a pharmacologist in Lagos, a PhD student in
              Jakarta — all get the same tools as a Roche scientist in Basel.
              AlphaDock democratises what was previously gated behind million-dollar
              infrastructure.
            </div>
          </div>
        </div>

        <div className="land-features">
          {features.map((feature) => (
            <div key={feature.title} className="feat-card" style={{ borderColor: feature.color }}>
              <div className="feat-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <div className="feat-title" style={{ color: feature.color }}>
                {feature.title}
              </div>
              <div className="feat-desc">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
