import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimulationAgentSidebar,
  type SimulationAgentMessage,
} from "../../components/agent/SimulationAgentSidebar";
import { DEMO_JOB_ID } from "../../constants/demo";

type SidebarTab = "results" | "bonds" | "admet";

const poseSequence = [
  { score: -9.8, rmsd: "1.12 Å", kd: "2.1 nM" },
  { score: -8.9, rmsd: "1.48 Å", kd: "6.4 nM" },
  { score: -8.4, rmsd: "1.77 Å", kd: "12.9 nM" },
  { score: -7.8, rmsd: "2.14 Å", kd: "29.8 nM" },
  { score: -7.2, rmsd: "2.52 Å", kd: "64.2 nM" },
  { score: -6.9, rmsd: "2.81 Å", kd: "89.1 nM" },
  { score: -6.3, rmsd: "3.18 Å", kd: "201 nM" },
  { score: -5.8, rmsd: "3.74 Å", kd: "485 nM" },
  { score: -5.1, rmsd: "4.23 Å", kd: "1.4 µM" },
];

const interactions = [
  { type: "H-bond", residue: "Asp381", distance: "2.1 Å", color: "#60a5fa", strong: true },
  { type: "Salt bridge", residue: "Glu286", distance: "3.2 Å", color: "#4ade80", strong: true },
  { type: "pi-stack", residue: "Tyr253", distance: "3.8 Å", color: "#a78bfa", strong: false },
  { type: "Hydrophobic", residue: "Leu370", distance: "3.9 Å", color: "#7a9cc0", strong: false },
];

const admetRows = [
  { name: "Oral bioavail.", value: 98, good: true },
  { name: "CYP3A4 inhibitor", value: 78, good: false },
  { name: "hERG risk", value: 18, good: true },
  { name: "BBB", value: 15, good: true },
  { name: "Solubility", value: 61, good: false },
];

const pipelineSteps = [
  "Initialising grid",
  "Loading force field",
  "Preparing receptor",
  "Generating conformers",
  "Searching poses",
  "Refining",
  "Clustering",
  "ADMET calc",
  "Finalising",
] as const;

const agentReplies: Array<{ match: string; task: string; action?: string; reply: string }> = [
  {
    match: "run",
    task: "Running docking...",
    action: "[ACTION] startDocking(exhaustiveness=32) ✓",
    reply:
      "Docking is running with a wider search. Watch the energy landscape populate as each pose is evaluated.",
  },
  {
    match: "water",
    task: "Toggling crystal waters...",
    action: "[ACTION] toggleWaterMolecules() ✓",
    reply:
      "Crystal waters are visible now. Waters near Asp381 and Thr315 can mediate the most meaningful bridging contacts.",
  },
  {
    match: "h-bond",
    task: "Filtering hydrogen bonds...",
    action: '[ACTION] filterView("hbonds_only") ✓',
    reply:
      "Three key hydrogen-bonding interactions are highlighted now. Asp381 remains the anchor contact for the best pose.",
  },
  {
    match: "score",
    task: "Interpreting docking score...",
    reply:
      "A -9.8 kcal/mol docking score corresponds to an estimated Kd around 2.1 nM, which is squarely in the clinically meaningful range for a kinase inhibitor like imatinib.",
  },
];

export function DockPage() {
  const navigate = useNavigate();
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [agentTask, setAgentTask] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<SimulationAgentMessage[]>([
    {
      id: "dock-1",
      kind: "ai",
      content:
        "I have full docking lab access. I can start or stop runs, change parameters, toggle water molecules, switch views, and interpret results live.",
    },
  ]);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("results");
  const [viewMode, setViewMode] = useState<"surface" | "stick" | "sphere">("surface");
  const [waterOn, setWaterOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState("Ready");
  const [selectedPose, setSelectedPose] = useState(1);
  const [poses, setPoses] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[AlphaDock] Ready"]);
  const timerRef = useRef<number | null>(null);
  const runRef = useRef<number | null>(null);

  const bestScore = poses.length ? Math.min(...poses) : null;

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (runRef.current) window.clearInterval(runRef.current);
    };
  }, []);

  const addLog = (content: string, kind?: "ok" | "hi" | "warn") => {
    const prefix = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs((current) => [...current, `[${prefix}] ${content}${kind ? `|${kind}` : ""}`]);
  };

  const startDock = () => {
    if (running) return;

    setRunning(true);
    setProgress(4);
    setElapsed(0);
    setStep("Starting");
    setPoses([]);
    setSelectedPose(1);
    setLogs([]);
    addLog("AlphaDock job started", "hi");
    addLog("BCR-ABL · 1IEP · Imatinib");
    addLog("Protein loaded from cache");
    addLog("Ligand prepared (Meeko PDBQT)");

    let tick = 0;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      tick += 0.1;
      setElapsed(Number(tick.toFixed(1)));
    }, 100);

    let stepIndex = 0;
    let poseIndex = 0;
    if (runRef.current) window.clearInterval(runRef.current);
    runRef.current = window.setInterval(() => {
      if (stepIndex < pipelineSteps.length) {
        setStep(pipelineSteps[stepIndex]);
        setProgress(Math.min(60, 8 + stepIndex * 7));
        if (pipelineSteps[stepIndex] !== "Searching poses") {
          addLog(`${pipelineSteps[stepIndex]} done`, "ok");
        }
      }

      if (stepIndex >= 3 && poseIndex < poseSequence.length) {
        const nextPose = poseSequence[poseIndex];
        setPoses((current) => [...current, nextPose.score]);
        setProgress((current) => Math.min(90, current + 5));
        addLog(`Pose ${poseIndex + 1}: ${nextPose.score.toFixed(1)} kcal/mol`);
        poseIndex += 1;
      }

      stepIndex += 1;

      if (poseIndex >= poseSequence.length) {
        if (runRef.current) window.clearInterval(runRef.current);
        if (timerRef.current) window.clearInterval(timerRef.current);
        setRunning(false);
        setProgress(100);
        setStep("Complete");
        setElapsed(23.1);
        setSidebarTab("results");
        setSelectedPose(1);
        addLog("ADMET prediction complete", "ok");
        addLog("AI interpretation complete", "hi");
        addLog("Done · Best: -9.8 kcal/mol · 9 poses", "hi");
      }
    }, 650);
  };

  const stopDock = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (runRef.current) window.clearInterval(runRef.current);
    setRunning(false);
    setStep("Stopped");
    addLog("Stopped", "warn");
  };

  const runAgent = (raw: string) => {
    const content = raw.trim();
    if (!content) return;
    setAgentMessages((current) => [...current, { id: `user-${Date.now()}`, kind: "user", content }]);
    setAgentInput("");

    const match: { task: string; action?: string; reply: string } =
      agentReplies.find((reply) => content.toLowerCase().includes(reply.match)) ?? {
      task: "Processing lab command...",
      reply:
        "I control the docking lab. Ask me to run docking, toggle water, switch views, or explain the score live.",
      };

    setAgentTask(match.task);
    window.setTimeout(() => {
      setAgentTask(null);
      if (match.action) {
        setAgentMessages((current) => [
          ...current,
          { id: `action-${Date.now()}`, kind: "action", content: match.action! },
        ]);
      }
      setAgentMessages((current) => [
        ...current,
        { id: `ai-${Date.now() + 1}`, kind: "ai", content: match.reply },
      ]);

      if (content.toLowerCase().includes("run")) startDock();
      if (content.toLowerCase().includes("water")) setWaterOn((value) => !value);
      if (content.toLowerCase().includes("surface")) setViewMode("surface");
    }, 700);
  };

  const selectedPoseData = poseSequence[selectedPose - 1] ?? poseSequence[0];

  const ligandStyle = useMemo(
    () =>
      poses.length
        ? [
            { top: `${52 - progress * 0.25}%`, left: `${58 - progress * 0.18}%` },
            { top: `${56 - progress * 0.18}%`, left: `${62 - progress * 0.2}%` },
            { top: `${60 - progress * 0.17}%`, left: `${54 - progress * 0.12}%` },
            { top: `${57 - progress * 0.2}%`, left: `${49 - progress * 0.13}%` },
          ]
        : [
            { top: "18%", left: "74%" },
            { top: "24%", left: "68%" },
            { top: "70%", left: "76%" },
            { top: "64%", left: "70%" },
          ],
    [poses.length, progress],
  );

  return (
    <section className="screen-shell">
      <div className="app-screen">
        <div className="dock-root">
          <div className="viewport">
            <div className="vp-top">
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: "var(--dim)" }}>
                TARGET
              </span>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: "var(--ac)" }}>
                BCR-ABL · 1IEP
              </span>
              <div className="sb-sep" />
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: "var(--dim)" }}>
                LIGAND
              </span>
              <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 11, color: "var(--ac)" }}>
                Imatinib
              </span>
              <div className="sb-sep" />
              <div style={{ display: "flex", gap: 3 }}>
                {(["surface", "stick", "sphere"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={viewMode === mode ? "vbtn on" : "vbtn"}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode === "surface" ? "Surface" : mode === "stick" ? "Stick" : "Sphere"}
                  </button>
                ))}
              </div>
              <div className="sb-sep" />
              <div style={{ display: "flex", gap: 3 }}>
                <button type="button" className={waterOn ? "vbtn on" : "vbtn"} onClick={() => setWaterOn((value) => !value)}>
                  Toggle water
                </button>
                <button type="button" className="vbtn">
                  Clean
                </button>
                <button type="button" className="vbtn">
                  H-bonds
                </button>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: "var(--dim)" }}>
                  EXHAUSTIVENESS
                </span>
                <input type="range" min="4" max="64" defaultValue="16" step="4" style={{ width: 65 }} />
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 10, color: "var(--ac)" }}>16</span>
              </div>
              <button className="open-agent-btn static" type="button" onClick={() => setAgentOpen((open) => !open)}>
                <div className="agent-dot" />
                AI
              </button>
            </div>

            <div className="viewport-stage">
              <div className="viewport-grid" />
              <div className="protein-cloud" style={{ top: "14%", left: "10%", width: 280, height: 220 }} />
              <div className="protein-cloud" style={{ top: "34%", right: "14%", width: 210, height: 180 }} />
              {ligandStyle.map((style, index) => (
                <div key={index} className="ligand-node" style={style} />
              ))}
              {poses.length
                ? interactions.slice(0, 3).map((bond, index) => (
                    <div
                      key={bond.residue}
                      className="interaction-line"
                      style={{
                        top: `${36 + index * 8}%`,
                        left: `${42 + index * 3}%`,
                        width: `${90 - index * 12}px`,
                        transform: `rotate(${index * 11 - 8}deg)`,
                        borderColor: bond.color,
                      }}
                    />
                  ))
                : null}

              <div className="hud">
                <div className="hud-chip">BCR-ABL · 1IEP</div>
                <div className="hud-chip">Poses: <span>{poses.length}</span></div>
                <div className="hud-chip">
                  Best: <span>{bestScore?.toFixed(1) ?? "—"}</span> kcal/mol
                </div>
                <div className="hud-chip">
                  Time: <span>{elapsed.toFixed(1)}s</span>
                </div>
              </div>
            </div>

            <div className="vp-bot">
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 100 }}>
                <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 8, color: "var(--dim)", letterSpacing: 1 }}>
                  ENERGY LANDSCAPE
                </span>
                <div className="ebar-wrap">
                  {poses.length ? (
                    poses.map((score, index) => {
                      const height = Math.max(8, Math.round(((Math.abs(score) - 4) / 7) * 100));
                      const color =
                        score <= -9 ? "var(--gr)" : score <= -7 ? "var(--ac)" : score <= -5 ? "var(--am)" : "var(--rd)";
                      return (
                        <button
                          key={`${score}-${index}`}
                          type="button"
                          className={selectedPose === index + 1 ? "ebar selected" : "ebar"}
                          style={{ height: `${height}%`, background: color, border: "none" }}
                          onClick={() => setSelectedPose(index + 1)}
                          title={`Pose ${index + 1} · ${score.toFixed(1)} kcal/mol`}
                        />
                      );
                    })
                  ) : (
                    <div style={{ fontSize: 10, color: "var(--dim)", fontFamily: '"Space Mono", monospace' }}>waiting</div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, padding: "0 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--mut)", marginBottom: 3 }}>
                  <span>{step}</span>
                  <span>{progress}%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {!running ? (
                <button className="run-btn" type="button" onClick={startDock}>
                  ▶ Run
                </button>
              ) : (
                <button className="stop-btn" type="button" onClick={stopDock}>
                  ■ Stop
                </button>
              )}
              {progress === 100 ? (
                <button className="btn btn-p" type="button" style={{ fontSize: 11 }} onClick={() => navigate(`/results/${DEMO_JOB_ID}`)}>
                  Results →
                </button>
              ) : null}
            </div>
          </div>

          <aside className="dock-sidebar">
            <div className="stabs">
              <button className={sidebarTab === "results" ? "stab on" : "stab"} type="button" onClick={() => setSidebarTab("results")}>
                Results
              </button>
              <button className={sidebarTab === "bonds" ? "stab on" : "stab"} type="button" onClick={() => setSidebarTab("bonds")}>
                Bonds
              </button>
              <button className={sidebarTab === "admet" ? "stab on" : "stab"} type="button" onClick={() => setSidebarTab("admet")}>
                ADMET
              </button>
            </div>

            <div className="sbody">
              {sidebarTab === "results" ? (
                <div className="ssec">
                  <div className="ssec-t">Scores</div>
                  <div className="srow">
                    <span className="sk">Vina</span>
                    <span className="sv g">{bestScore?.toFixed(1) ?? "—"} kcal/mol</span>
                  </div>
                  <div className="srow">
                    <span className="sk">Est. Kd</span>
                    <span className="sv">{selectedPoseData.kd}</span>
                  </div>
                  <div className="srow">
                    <span className="sk">RMSD</span>
                    <span className="sv">{selectedPoseData.rmsd}</span>
                  </div>
                  <div className="ssec" style={{ marginTop: 12 }}>
                    <div className="ssec-t">Ligand</div>
                    <div className="srow">
                      <span className="sk">MW</span>
                      <span className="sv">493 Da</span>
                    </div>
                    <div className="srow">
                      <span className="sk">logP</span>
                      <span className="sv">3.1</span>
                    </div>
                    <div className="srow">
                      <span className="sk">Lipinski</span>
                      <span className="sv g">Pass ✓</span>
                    </div>
                  </div>
                  <div className="ssec" style={{ marginTop: 12 }}>
                    <div className="ssec-t">Pocket</div>
                    <div className="srow">
                      <span className="sk">Volume</span>
                      <span className="sv">892 Å³</span>
                    </div>
                    <div className="srow">
                      <span className="sk">Druggability</span>
                      <span className="sv g">0.91</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {sidebarTab === "bonds" ? (
                <>
                  <div className="ssec-t">Interactions</div>
                  {poses.length ? (
                    interactions.map((bond) => (
                      <div key={bond.residue} className="bond-item">
                        <div className="bdot" style={{ background: bond.color }} />
                        <span style={{ color: bond.color, fontWeight: 600, minWidth: 68 }}>{bond.type}</span>
                        <span style={{ color: "var(--mut)" }}>{bond.residue}</span>
                        <span style={{ fontFamily: '"Space Mono", monospace', fontSize: 9, color: "var(--dim)" }}>
                          {bond.distance}
                        </span>
                        {bond.strong ? <span className="tag tg" style={{ fontSize: 8 }}>strong</span> : null}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--dim)", padding: "6px 0" }}>Run docking first</div>
                  )}
                  <div className="ssec-t" style={{ marginTop: 10 }}>
                    Resistance
                  </div>
                  {poses.length ? (
                    <div style={{ fontSize: 11, color: "var(--dim)" }}>
                      <div style={{ color: "var(--rd)", fontSize: 10, marginBottom: 2 }}>
                        T315I: -5.1 <span className="tag tr">Resistant</span>
                      </div>
                      <div style={{ color: "var(--gr)", fontSize: 10 }}>
                        M351T: -8.9 <span className="tag tg">Sensitive</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--dim)" }}>Not configured</div>
                  )}
                </>
              ) : null}

              {sidebarTab === "admet" ? (
                <>
                  <div className="ssec-t">ADMET</div>
                  {poses.length ? (
                    admetRows.map((row) => (
                      <div key={row.name} style={{ marginBottom: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                          <span style={{ color: "var(--mut)" }}>{row.name}</span>
                          <span
                            style={{
                              color: row.good ? "var(--gr)" : "var(--am)",
                              fontFamily: '"Space Mono", monospace',
                            }}
                          >
                            {row.value}%
                          </span>
                        </div>
                        <div className="pbar">
                          <div
                            className="pfill"
                            style={{
                              width: `${row.value}%`,
                              background: row.good ? "var(--gr)" : "var(--am)",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--dim)", padding: "6px 0" }}>Run docking first</div>
                  )}
                </>
              ) : null}
            </div>

            <div className="log-panel">
              {logs.map((line, index) => {
                const [content, kind] = line.split("|");
                return (
                  <div key={`${content}-${index}`} className={kind ? `log-l ${kind}` : "log-l"}>
                    {content}
                  </div>
                );
              })}
            </div>
          </aside>

          <SimulationAgentSidebar
            open={agentOpen}
            screenKey="dock"
            status="● docking agent"
            messages={agentMessages}
            task={agentTask}
            suggestions={[
              "Run docking with exhaustiveness 32",
              "Toggle water molecules",
              "Show only hydrogen bonds",
              "What does this score mean?",
              "Show surface view",
            ]}
            inputValue={agentInput}
            inputPlaceholder="Control the docking lab..."
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
