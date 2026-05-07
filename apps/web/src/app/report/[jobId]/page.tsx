import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimulationAgentSidebar,
  type SimulationAgentMessage,
} from "../../../components/agent/SimulationAgentSidebar";

const nextSteps = [
  {
    title: "Add fluorine at C4 phenyl",
    detail: "Blocks CYP3A4 oxidation. Expected Δ: +0.5 kcal/mol. Improves metabolic stability.",
    color: "var(--ac)",
    priority: "High",
    tag: "tg",
  },
  {
    title: "Screen T315I (PDB 2HYY)",
    detail: "Score drops to -5.1 — confirm resistance. Evaluate ponatinib for T315I coverage.",
    color: "var(--rd)",
    priority: "Critical",
    tag: "tr",
  },
  {
    title: "MM-GBSA rescoring (AmberTools)",
    detail: "Refine from ±3 to ±1.5 kcal/mol. Free with AmberTools. Use top 3 poses.",
    color: "var(--am)",
    priority: "High",
    tag: "tg",
  },
  {
    title: "Synthesise sulfonamide analogue",
    detail: "+1.0 kcal/mol predicted via new H-bond with His361. Best structural modification.",
    color: "var(--gr)",
    priority: "High",
    tag: "tg",
  },
  {
    title: "PDGFR-α / PDGFR-β selectivity screen",
    detail: "Off-target ratios 0.91/0.89 — flag oedema risk before animal studies.",
    color: "var(--pu2)",
    priority: "Medium",
    tag: "ta",
  },
] as const;

const agentReplies: Array<{ match: string; reply: string }> = [
  {
    match: "pdf",
    reply:
      "The PDF report is ready. It includes binding mechanism, all nine poses, the resistance panel, ADMET liabilities, and the prioritised next-step list.",
  },
  {
    match: "t315i",
    reply:
      "A T315I-resistant direction would look ponatinib-like: bulkier hydrophobic substitution to avoid the gatekeeper clash while retaining hinge recognition.",
  },
  {
    match: "dfg",
    reply:
      "DFG-out means the kinase adopts its inactive conformation. Imatinib is a classic Type II inhibitor, so this conformation is central to why the binding story works.",
  },
  {
    match: "clinical",
    reply:
      "Clinically, this pattern matches the known CML story: strong wild-type coverage, poor T315I resilience, and a profile that points toward careful mutation-aware use.",
  },
];

export function ReportPage() {
  const navigate = useNavigate();
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [messages, setMessages] = useState<SimulationAgentMessage[]>([
    {
      id: "report-1",
      kind: "ai",
      content:
        "I've completed the analysis. I can generate a PDF report, design improved analogues, explain resistance mechanisms, or help plan the next experiment.",
    },
  ]);

  const runAgent = (raw: string) => {
    const content = raw.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, kind: "user", content }]);
    setAgentInput("");
    const reply = agentReplies.find((item) => content.toLowerCase().includes(item.match))?.reply
      ?? "I can package the report, explain the DFG-out mechanism, discuss clinical context, or design a mock T315I-resistant analogue.";
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: `ai-${Date.now()}`, kind: "ai", content: reply }]);
    }, 650);
  };

  return (
    <section className="screen-shell">
      <div className="app-screen">
        <div className="screen-topbar">
          <div className="sb-title">AI interpretation report</div>
          <div className="sb-sep" />
          <div className="sb-sub">BCR-ABL · Imatinib · -9.8 kcal/mol · Claude-powered</div>
          <button className="open-agent-btn static" type="button" onClick={() => setAgentOpen((open) => !open)}>
            <div className="agent-dot" />
            AlphaDock AI
          </button>
        </div>

        <div className="split-layout">
          <div className={agentOpen ? "main-area agent-open report-body" : "main-area report-body"}>
            <div className="ai-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div className="agent-icon">AI</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ac)" }}>
                  AlphaDock AI · Binding analysis
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#b8d4f0", lineHeight: 1.7 }}>
                Imatinib docks at <strong style={{ color: "var(--gr)" }}>-9.8 kcal/mol</strong> into
                the BCR-ABL ATP-binding site, fully consistent with its nanomolar clinical potency
                (IC₅₀ ~3 nM). The critical DFG-out inactive conformation is correctly captured.
                Three strong interactions anchor the pose: H-bond with Asp381 (2.1 Å), salt bridge
                with Glu286 (3.2 Å), and pi-stacking with Tyr253 (3.8 Å). Confidence is high —
                this matches co-crystal geometry within 1.2 Å RMSD.
              </div>
            </div>

            <div className="g2" style={{ marginBottom: 12 }}>
              <div className="card">
                <div className="card-t">Resistance panel</div>
                {[
                  ["Wild-type (1IEP)", "-9.8", "tg", "Sensitive"],
                  ["T315I gatekeeper", "-5.1", "tr", "Resistant"],
                  ["E255K P-loop", "-6.8", "ta", "Moderate"],
                  ["M351T", "-8.9", "tg", "Sensitive"],
                  ["Y253H", "-7.2", "ta", "Moderate"],
                ].map(([name, score, tag, label]) => (
                  <div key={name} className="row">
                    <span className="rk">{name}</span>
                    <span className="rv">{score}</span>
                    <span className={`tag ${tag}`}>{label}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 7 }}>
                  T315I is a critical resistance signal. Consider ponatinib-like scaffolds or
                  allosteric alternatives for that background.
                </div>
              </div>

              <div className="card">
                <div className="card-t">Binding mechanism</div>
                <div style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.7 }}>
                  Imatinib selects the <span style={{ color: "var(--ac)" }}>inactive DFG-out</span>{" "}
                  conformation, locking the activation loop. The aminopyrimidine motif engages the
                  hinge region, while the piperazine segment stays solvent-exposed and helps explain
                  the selectivity profile across kinases.
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 12 }}>
              <div className="card-t">Prioritised next steps</div>
              {nextSteps.map((step, index) => (
                <div key={step.title} className="nstep" style={{ borderColor: step.color }}>
                  <span className="ns-n">0{index + 1}</span>
                  <div>
                    <div className="ns-t" style={{ color: step.color }}>
                      {step.title}
                    </div>
                    <div className="ns-d">{step.detail}</div>
                  </div>
                  <span className={`tag ${step.tag}`} style={{ flexShrink: 0 }}>
                    {step.priority}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-g" type="button">
                Download PDF report
              </button>
              <button className="btn btn-p" type="button">
                Design analogue ↗
              </button>
              <button className="btn btn-am" type="button">
                Explain T315I ↗
              </button>
              <button className="btn btn-s" type="button" onClick={() => navigate("/input")}>
                New job →
              </button>
            </div>
          </div>

          <SimulationAgentSidebar
            open={agentOpen}
            screenKey="report"
            status="● report agent"
            messages={messages}
            suggestions={[
              "Generate full PDF report",
              "Design a T315I-resistant analogue",
              "Explain DFG-out mechanism",
              "What is the clinical significance?",
            ]}
            inputValue={agentInput}
            inputPlaceholder="Explore the report..."
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
