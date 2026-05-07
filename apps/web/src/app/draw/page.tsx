import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimulationAgentSidebar,
  type SimulationAgentMessage,
} from "../../components/agent/SimulationAgentSidebar";

type Atom = { id: number; x: number; y: number; el: string };
type Bond = { id: number; a: number; b: number; type: "single" | "double" | "aromatic" };

const elementColors: Record<string, string> = {
  C: "#ddeeff",
  N: "#60a5fa",
  O: "#f87171",
  S: "#fbbf24",
  F: "#4ade80",
  Cl: "#4ade80",
  Br: "#fb923c",
  P: "#b09aff",
};

function createRing(type: "benzene" | "pyridine" | "pip" | "imidazole", startId: number) {
  const count = type === "imidazole" ? 5 : 6;
  const radius = type === "pip" ? 44 : 50;
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];

  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
    let el = "C";
    if (type === "pyridine" && index === 0) el = "N";
    if (type === "pip" && (index === 0 || index === 3)) el = "N";
    if (type === "imidazole" && (index === 0 || index === 2)) el = "N";

    atoms.push({
      id: startId + index,
      x: 250 + Math.cos(angle) * radius,
      y: 160 + Math.sin(angle) * radius,
      el,
    });
  }

  for (let index = 0; index < count; index += 1) {
    bonds.push({
      id: startId + 100 + index,
      a: atoms[index].id,
      b: atoms[(index + 1) % count].id,
      type:
        type === "benzene" || type === "pyridine" || type === "imidazole"
          ? index % 2 === 0
            ? "aromatic"
            : "single"
          : "single",
    });
  }

  return { atoms, bonds };
}

export function DrawPage() {
  const navigate = useNavigate();
  const [agentOpen, setAgentOpen] = useState(false);
  const [activeElement, setActiveElement] = useState("C");
  const [activeBondType, setActiveBondType] = useState<Bond["type"]>("single");
  const [{ atoms, bonds }, setStructure] = useState(() => createRing("benzene", 1));
  const [selectedAtom, setSelectedAtom] = useState<number | null>(null);
  const [agentInput, setAgentInput] = useState("");
  const [agentTask, setAgentTask] = useState<string | null>(null);
  const [messages, setMessages] = useState<SimulationAgentMessage[]>([
    {
      id: "draw-1",
      kind: "ai",
      content:
        "I have full draw access. I can place atoms, add rings, draw complete scaffolds, or clear the canvas. Just describe what you want.",
    },
    {
      id: "draw-2",
      kind: "ai",
      content:
        'Try: "Draw imatinib scaffold", "Add a benzene ring with a nitrogen substituent", or "Add piperazine ring".',
    },
  ]);

  const smiles = useMemo(() => {
    if (!atoms.length) return "(place atoms above)";
    return atoms.map((atom) => (atom.el === "C" ? "c" : atom.el.toLowerCase())).join("");
  }, [atoms]);

  const approxMass = useMemo(
    () =>
      atoms.reduce(
        (sum, atom) =>
          sum +
          ({ C: 12, N: 14, O: 16, S: 32, F: 19, Cl: 35, Br: 80, P: 31 }[atom.el] ?? 12),
        0,
      ) + atoms.length,
    [atoms],
  );

  const setRing = (type: "benzene" | "pyridine" | "pip" | "imidazole") => {
    setStructure(createRing(type, 1));
    setSelectedAtom(null);
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = atoms.length ? Math.max(...atoms.map((atom) => atom.id)) + 1 : 1;
    const nextAtom = { id, x, y, el: activeElement };

    if (selectedAtom !== null) {
      setStructure((current) => ({
        atoms: [...current.atoms, nextAtom],
        bonds: [
          ...current.bonds,
          {
            id: (current.bonds.at(-1)?.id ?? 0) + 1,
            a: selectedAtom,
            b: id,
            type: activeBondType,
          },
        ],
      }));
    } else {
      setStructure((current) => ({ atoms: [...current.atoms, nextAtom], bonds: current.bonds }));
    }

    setSelectedAtom(id);
  };

  const runAgent = (raw: string) => {
    const content = raw.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, kind: "user", content }]);
    setAgentTask("Executing on canvas...");
    setAgentInput("");

    const lower = content.toLowerCase();
    window.setTimeout(() => {
      setAgentTask(null);
      if (lower.includes("benzene")) {
        setRing("benzene");
        setMessages((current) => [
          ...current,
          { id: `action-${Date.now()}`, kind: "action", content: '[ACTION] add_ring("benzene") ✓' },
          {
            id: `ai-${Date.now() + 1}`,
            kind: "ai",
            content: "Benzene ring placed at canvas center. You can extend it by clicking any atom.",
          },
        ]);
        return;
      }

      if (lower.includes("piperazine")) {
        setRing("pip");
        setMessages((current) => [
          ...current,
          { id: `action-${Date.now()}`, kind: "action", content: '[ACTION] add_ring("piperazine") ✓' },
          {
            id: `ai-${Date.now() + 1}`,
            kind: "ai",
            content: "Piperazine placed. Two nitrogens are positioned in the six-membered ring.",
          },
        ]);
        return;
      }

      if (lower.includes("imatinib")) {
        setRing("benzene");
        setMessages((current) => [
          ...current,
          {
            id: `action-${Date.now()}`,
            kind: "action",
            content: '[ACTION] draw_scaffold("imatinib_core") ✓',
          },
          {
            id: `ai-${Date.now() + 1}`,
            kind: "ai",
            content:
              "Imatinib core scaffold staged: benzene-first with room to add the aminopyrimidine and piperazine extensions.",
          },
        ]);
        return;
      }

      if (lower.includes("clear")) {
        setStructure({ atoms: [], bonds: [] });
        setSelectedAtom(null);
        setMessages((current) => [
          ...current,
          { id: `action-${Date.now()}`, kind: "action", content: "[ACTION] clear_canvas() ✓" },
          { id: `ai-${Date.now() + 1}`, kind: "ai", content: "Canvas cleared. Ready for a fresh scaffold." },
        ]);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          kind: "ai",
          content:
            "I can add benzene, pyridine, piperazine, or imidazole rings, clear the canvas, or help you sketch a kinase inhibitor scaffold.",
        },
      ]);
    }, 700);
  };

  return (
    <section className="screen-shell">
      <div className="app-screen">
        <div className="screen-topbar">
          <div className="sb-title">Draw molecule</div>
          <div className="sb-sep" />
          <div className="sb-sub">Click canvas to place atoms · click two atoms to bond</div>
          <button className="open-agent-btn" type="button" onClick={() => setAgentOpen((open) => !open)}>
            <div className="agent-dot" />
            AlphaDock AI
          </button>
        </div>

        <div className="split-layout">
          <div className={agentOpen ? "main-area agent-open" : "main-area"}>
            <div className="draw-page-main">
              <div className="draw-workspace">
                <div className="draw-canvas-shell">
                  <div className="draw-grid" />
                  <svg className="draw-svg" viewBox="0 0 500 320" onClick={handleCanvasClick}>
                    {bonds.map((bond) => {
                      const a = atoms.find((atom) => atom.id === bond.a);
                      const b = atoms.find((atom) => atom.id === bond.b);
                      if (!a || !b) return null;
                      return (
                        <g key={bond.id}>
                          <line
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            className={`draw-bond ${bond.type === "double" ? "double" : bond.type === "aromatic" ? "aromatic" : ""}`}
                          />
                          {bond.type === "double" ? (
                            <line
                              x1={a.x}
                              y1={a.y + 4}
                              x2={b.x}
                              y2={b.y + 4}
                              className="draw-bond double"
                            />
                          ) : null}
                        </g>
                      );
                    })}
                    {atoms.map((atom) => (
                      <g
                        key={atom.id}
                        className={selectedAtom === atom.id ? "draw-atom selected" : "draw-atom"}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (selectedAtom && selectedAtom !== atom.id) {
                            setStructure((current) => ({
                              atoms: current.atoms,
                              bonds: [
                                ...current.bonds,
                                {
                                  id: (current.bonds.at(-1)?.id ?? 0) + 1,
                                  a: selectedAtom,
                                  b: atom.id,
                                  type: activeBondType,
                                },
                              ],
                            }));
                            setSelectedAtom(null);
                          } else {
                            setSelectedAtom(atom.id);
                          }
                        }}
                      >
                        <circle cx={atom.x} cy={atom.y} r="11" />
                        <text x={atom.x} y={atom.y} fill={elementColors[atom.el] ?? "#ddeeff"}>
                          {atom.el}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="card" style={{ margin: 0 }}>
                  <div className="card-t">Generated SMILES</div>
                  <div
                    style={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: 10,
                      color: "var(--ac)",
                      background: "var(--bg4)",
                      borderRadius: 5,
                      padding: 7,
                      wordBreak: "break-all",
                      minHeight: 28,
                      marginBottom: 6,
                    }}
                  >
                    {smiles}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--gr)" }}>
                    Valid · ~{Math.round(approxMass)} Da · {atoms.length} heavy atoms
                  </div>
                </div>

                <button className="btn btn-g" type="button" style={{ padding: 9, fontSize: 13 }} onClick={() => navigate("/dock")}>
                  Dock this molecule →
                </button>
              </div>

              <aside className="draw-sidebar">
                <div className="lbl" style={{ marginBottom: 6 }}>
                  Atom type
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {["C", "N", "O", "S", "F", "Cl", "Br", "P"].map((element) => (
                    <button
                      key={element}
                      className="btn btn-s"
                      type="button"
                      onClick={() => setActiveElement(element)}
                      style={{
                        fontFamily: '"Space Mono", monospace',
                        minWidth: 34,
                        fontWeight: 700,
                        color: elementColors[element] ?? "#ddeeff",
                        borderColor: activeElement === element ? "var(--ac)" : "var(--bd)",
                        background: activeElement === element ? "var(--bg3)" : "var(--bg4)",
                      }}
                    >
                      {element}
                    </button>
                  ))}
                </div>

                <div className="lbl" style={{ marginBottom: 5 }}>
                  Bond type
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                  {[
                    ["single", "Single"],
                    ["double", "Double"],
                    ["aromatic", "Aromatic"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      className="btn btn-s"
                      type="button"
                      onClick={() => setActiveBondType(value as Bond["type"])}
                      style={{
                        background: activeBondType === value ? "rgba(0,207,255,.1)" : "var(--bg4)",
                        color: activeBondType === value ? "var(--ac)" : "var(--mut)",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="lbl" style={{ marginBottom: 5 }}>
                  Add ring
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                  <button className="btn btn-s" type="button" onClick={() => setRing("benzene")}>
                    Benzene
                  </button>
                  <button className="btn btn-s" type="button" onClick={() => setRing("pyridine")}>
                    Pyridine
                  </button>
                  <button className="btn btn-s" type="button" onClick={() => setRing("pip")}>
                    Piperazine
                  </button>
                  <button className="btn btn-s" type="button" onClick={() => setRing("imidazole")}>
                    Imidazole
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button className="btn btn-am" type="button" onClick={() => setStructure({ atoms: [], bonds: [] })}>
                    Clear
                  </button>
                  <button
                    className="btn btn-s"
                    type="button"
                    onClick={() =>
                      setStructure((current) => ({
                        atoms: current.atoms.slice(0, -1),
                        bonds: current.bonds.slice(0, -1),
                      }))
                    }
                  >
                    Undo
                  </button>
                </div>
              </aside>
            </div>
          </div>

          <SimulationAgentSidebar
            open={agentOpen}
            screenKey="draw"
            status="● draw agent · super access"
            messages={messages}
            task={agentTask}
            suggestions={[
              "Draw benzene ring",
              "Add piperazine ring",
              "Draw imatinib scaffold",
              "Clear canvas",
              "Add nitrogen at position 3",
            ]}
            inputValue={agentInput}
            inputPlaceholder="Tell AI to draw..."
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
