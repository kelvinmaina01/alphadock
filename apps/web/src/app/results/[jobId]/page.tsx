import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SimulationAgentSidebar,
  type SimulationAgentMessage,
} from "../../../components/agent/SimulationAgentSidebar";
import { DEMO_JOB_ID } from "../../../constants/demo";

const poseScores = [-9.8, -8.9, -8.4, -7.8, -7.2, -6.9, -6.3, -5.8, -5.1];
const interactions = [
  { type: "H-bond", residue: "Asp381", distance: "2.1", color: "#60a5fa", strong: true },
  { type: "Salt bridge", residue: "Glu286", distance: "3.2", color: "#4ade80", strong: true },
  { type: "pi-stack", residue: "Tyr253", distance: "3.8", color: "#a78bfa", strong: true },
  { type: "Hydrophobic", residue: "Leu370", distance: "3.9", color: "#7a9cc0", strong: false },
];

const admetCards = [
  { name: "Oral bioavail.", value: 98, good: true },
  { name: "CYP3A4", value: 78, good: false },
  { name: "hERG risk", value: 18, good: true },
  { name: "BBB", value: 15, good: true },
  { name: "Solubility", value: 61, good: false },
  { name: "PPB", value: 95, good: false },
];

const agentReplies: Array<{ match: string; reply: string }> = [
  {
    match: "score",
    reply:
      "Score -9.8 kcal/mol means the best pose is in a strong nanomolar-like range for BCR-ABL. It matches the known imatinib story unusually well.",
  },
  {
    match: "binding",
    reply:
      "The best improvement path is usually around the solvent-exposed region. Fluorination and sulfonamide substitutions are the most believable next mock moves here.",
  },
  {
    match: "report",
    reply:
      "The full AI report is ready to open. It already includes resistance interpretation and prioritised next-step recommendations.",
  },
  {
    match: "t315i",
    reply:
      "T315I is a hard fail here: -5.1 kcal/mol versus -9.8 wild type. The gatekeeper mutation creates a steric clash that breaks the imatinib binding mode.",
  },
];

export function ResultsPage() {
  const navigate = useNavigate();
  const { jobId = DEMO_JOB_ID } = useParams();
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [messages, setMessages] = useState<SimulationAgentMessage[]>([
    {
      id: "results-1",
      kind: "ai",
      content:
        "Results are in. -9.8 kcal/mol is an excellent score for BCR-ABL. I can explain the score, suggest modifications, generate the report, or compare resistance mutants.",
    },
  ]);

  const runAgent = (raw: string) => {
    const content = raw.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, kind: "user", content }]);
    setAgentInput("");
    const reply = agentReplies.find((item) => content.toLowerCase().includes(item.match))?.reply
      ?? "I can explain the score, generate the report, suggest analogues, or screen resistance mutants like T315I.";
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: `ai-${Date.now()}`, kind: "ai", content: reply }]);
    }, 650);
  };

  return (
    <section className="screen-shell">
      <div className="app-screen">
        <div className="screen-topbar">
          <div className="sb-title">Docking results</div>
          <div className="sb-sep" />
          <div className="sb-sub">BCR-ABL · Imatinib · Vina · ex=16 · 9 poses</div>
          <button className="open-agent-btn static" type="button" onClick={() => setAgentOpen((open) => !open)}>
            <div className="agent-dot" />
            AlphaDock AI
          </button>
        </div>

        <div className="split-layout">
          <div className={agentOpen ? "main-area agent-open results-body" : "main-area results-body"}>
            <div className="stat-grid">
              <div className="stat-c glow-g">
                <div className="sc-v" style={{ color: "var(--gr)" }}>
                  -9.8
                </div>
                <div className="sc-l">kcal/mol best score</div>
              </div>
              <div className="stat-c">
                <div className="sc-v">2.1 nM</div>
                <div className="sc-l">estimated Kd</div>
              </div>
              <div className="stat-c">
                <div className="sc-v" style={{ color: "var(--ac)" }}>
                  88%
                </div>
                <div className="sc-l">pose confidence</div>
              </div>
              <div className="stat-c">
                <div className="sc-v">9</div>
                <div className="sc-l">poses generated</div>
              </div>
            </div>

            <div className="g2" style={{ marginBottom: 12 }}>
              <div className="card">
                <div className="card-t">All poses ranked</div>
                {poseScores.map((score, index) => {
                  const percent = Math.round(((Math.abs(score) - 4) / 7) * 100);
                  const color =
                    score <= -9 ? "var(--gr)" : score <= -7 ? "var(--ac)" : score <= -5 ? "var(--am)" : "var(--rd)";
                  return (
                    <div
                      key={`${score}-${index}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "3px 0",
                        borderBottom: "1px solid var(--bd)",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ color: "var(--dim)", minWidth: 50, fontFamily: '"Space Mono", monospace' }}>
                        P{index + 1}
                        {index === 0 ? " ★" : ""}
                      </span>
                      <div style={{ flex: 1, background: "var(--bg4)", borderRadius: 2, height: 4, overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: color, borderRadius: 2 }} />
                      </div>
                      <span
                        style={{
                          color,
                          fontFamily: '"Space Mono", monospace',
                          fontSize: 9,
                          minWidth: 76,
                          textAlign: "right",
                        }}
                      >
                        {score} kcal/mol
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="card">
                <div className="card-t">Interactions detected</div>
                {interactions.map((bond) => (
                  <div key={bond.residue} className="bond-item" style={{ marginBottom: 4 }}>
                    <div className="bdot" style={{ background: bond.color }} />
                    <span style={{ color: bond.color, fontWeight: 600, minWidth: 76 }}>{bond.type}</span>
                    <span style={{ color: "var(--mut)", flex: 1 }}>{bond.residue}</span>
                    <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: "var(--dim)" }}>
                      {bond.distance}Å
                    </span>
                    {bond.strong ? <span className="tag tg" style={{ fontSize: 8 }}>strong</span> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 12 }}>
              <div className="card-t">ADMET profile</div>
              <div className="g3">
                {admetCards.map((item) => (
                  <div key={item.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                      <span style={{ color: "var(--mut)" }}>{item.name}</span>
                      <span
                        style={{
                          color: item.good ? "var(--gr)" : "var(--am)",
                          fontFamily: '"Space Mono", monospace',
                        }}
                      >
                        {item.value}%
                      </span>
                    </div>
                    <div className="pbar">
                      <div className="pfill" style={{ width: `${item.value}%`, background: item.good ? "var(--gr)" : "var(--am)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-g" type="button" onClick={() => navigate(`/report/${jobId}`)}>
                View AI report →
              </button>
              <button className="btn btn-s" type="button">
                Export results
              </button>
              <button className="btn btn-p" type="button" onClick={() => navigate("/input")}>
                New job
              </button>
            </div>
          </div>

          <SimulationAgentSidebar
            open={agentOpen}
            screenKey="results"
            status="● results agent"
            messages={messages}
            suggestions={[
              "Explain the binding score",
              "What modifications would improve binding?",
              "Generate a PDF report",
              "Screen T315I mutant",
            ]}
            inputValue={agentInput}
            inputPlaceholder="Ask about these results..."
            onInputChange={setAgentInput}
            onSubmit={() => runAgent(agentInput)}
            onSuggestion={runAgent}
            onClose={() => setAgentOpen(false)}
          />
        </div>
      </div>
    </section>
  );
}
