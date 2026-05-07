import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimulationAgentSidebar,
  type SimulationAgentMessage,
} from "../../components/agent/SimulationAgentSidebar";

type InputTab = "smiles" | "protein" | "upload" | "batch";

type MoleculePreset = {
  name: string;
  smiles: string;
  mw: number;
  logp: number;
  hbd: number;
  hba: number;
  rot: number;
  formula: string;
  tpsa: string;
};

const presets: MoleculePreset[] = [
  {
    name: "Imatinib",
    smiles:
      "CC1=CC=C(C=C1)NC2=NC=CC(=N2)NC3=CC(=C(C=C3)CN4CCN(CC4)C)OC",
    mw: 493,
    logp: 3.1,
    hbd: 4,
    hba: 8,
    rot: 7,
    formula: "C₂₉H₃₁N₇O",
    tpsa: "111 Å²",
  },
  {
    name: "Erlotinib",
    smiles: "COCCOC1=CC2=C(C=C1OCCO)C(=NC=N2)NC3=CC=CC(=C3)C#C",
    mw: 393,
    logp: 2.8,
    hbd: 1,
    hba: 5,
    rot: 5,
    formula: "C₂₂H₂₃N₃O₄",
    tpsa: "74 Å²",
  },
  {
    name: "Ibuprofen",
    smiles: "CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    mw: 206,
    logp: 3.9,
    hbd: 1,
    hba: 2,
    rot: 4,
    formula: "C₁₃H₁₈O₂",
    tpsa: "37 Å²",
  },
  {
    name: "Nirmatrelvir",
    smiles: "CC1(C2CC1NC(=O)C(F)(F)F)C(=O)NC3CC3C4=CC=CC=C4",
    mw: 499,
    logp: 2.1,
    hbd: 3,
    hba: 7,
    rot: 6,
    formula: "C₂₃H₃₂F₃N₅O₄",
    tpsa: "112 Å²",
  },
];

const tabLabels: Array<[InputTab, string]> = [
  ["smiles", "Paste SMILES"],
  ["protein", "Protein / target"],
  ["upload", "Upload file"],
  ["batch", "Batch screen"],
];

const searchChoices = [
  { name: "Aspirin", mw: 180, target: "COX-1/2" },
  { name: "Gefitinib", mw: 446, target: "EGFR" },
  { name: "Vemurafenib", mw: 490, target: "BRAF V600E" },
];

const agentReplies: Array<{ match: string; thinking: string; action?: string; reply: string }> = [
  {
    match: "imatinib",
    thinking: "Loading imatinib from DrugBank...",
    action: '[ACTION] load_molecule("Imatinib", smiles) ✓',
    reply:
      "Done! Imatinib is loaded in the SMILES box. MW 493 Da, logP 3.1, Lipinski pass, and it's ready for BCR-ABL docking.",
  },
  {
    match: "bcr-abl",
    thinking: "Searching ChEMBL for BCR-ABL inhibitors...",
    action: '[ACTION] search_chembl("BCR-ABL inhibitors") ✓',
    reply:
      "I found a strong kinase set for BCR-ABL: imatinib, dasatinib, ponatinib, and nilotinib. Imatinib is the current lead and maps well to 1IEP.",
  },
  {
    match: "admet",
    thinking: "Calling ADMETlab 3.0...",
    action: '[ACTION] run_admet("current_smiles") ✓',
    reply:
      "ADMET quick check: oral bioavailability 98% ✓, CYP3A4 liability moderate ⚠, hERG low ✓, BBB low. The main thing to keep visible is CYP3A4 metabolism.",
  },
  {
    match: "1iep",
    thinking: "Fetching PDB structure 1IEP...",
    action: '[ACTION] fetch_structure("1IEP") ✓',
    reply:
      "BCR-ABL 1IEP is ready. Pocket 1 is selected automatically as the ATP-binding site, with volume 892 Å³ and P2Rank score 0.91.",
  },
];

function MoleculePreview({ molecule }: { molecule: MoleculePreset }) {
  return (
    <div className="card">
      <div className="card-t">2D preview</div>
      <div
        style={{
          width: "100%",
          height: 130,
          background: "#020609",
          border: "1px solid var(--bd)",
          borderRadius: 7,
          marginBottom: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 340 130">
          <g stroke="var(--ac)" strokeWidth="1.5" fill="none" opacity="0.9">
            <circle cx="85" cy="64" r="26" />
            <circle cx="145" cy="64" r="20" />
            <circle cx="206" cy="64" r="24" />
            <circle cx="260" cy="64" r="18" />
            <path d="M111 64H125M165 64H182M230 64H242" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>
      <div className="row">
        <span className="rk">Formula</span>
        <span className="rv">{molecule.formula}</span>
      </div>
      <div className="row">
        <span className="rk">MW</span>
        <span className="rv">{molecule.mw.toFixed(1)} Da</span>
      </div>
      <div className="row">
        <span className="rk">logP</span>
        <span className="rv">{molecule.logp}</span>
      </div>
      <div className="row">
        <span className="rk">TPSA</span>
        <span className="rv">{molecule.tpsa}</span>
      </div>
    </div>
  );
}

export function InputPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InputTab>("smiles");
  const [agentOpen, setAgentOpen] = useState(false);
  const [smiles, setSmiles] = useState(presets[0].smiles);
  const [molecule, setMolecule] = useState<MoleculePreset>(presets[0]);
  const [nameSearch, setNameSearch] = useState("");
  const [agentInput, setAgentInput] = useState("");
  const [agentTask, setAgentTask] = useState<string | null>(null);
  const [messages, setMessages] = useState<SimulationAgentMessage[]>([
    {
      id: "input-1",
      kind: "ai",
      content:
        "Hi! I'm your input AI agent. I can search databases, validate SMILES, suggest targets, or load molecules for you. What are you working on?",
    },
    {
      id: "input-2",
      kind: "ai",
      content:
        'Try: "Search BCR-ABL inhibitors in ChEMBL" or "Load imatinib and check its Lipinski properties".',
    },
  ]);
  const [uploadState, setUploadState] = useState<null | {
    status: string;
    items: string[];
    logLines: string[];
  }>(null);
  const [batchProgress, setBatchProgress] = useState(0);

  const filteredChoices = useMemo(
    () =>
      nameSearch.length < 2
        ? []
        : searchChoices.filter((choice) =>
            choice.name.toLowerCase().includes(nameSearch.toLowerCase()),
          ),
    [nameSearch],
  );

  const runAgent = (raw: string) => {
    const content = raw.trim();
    if (!content) return;

    setMessages((current) => [...current, { id: `user-${Date.now()}`, kind: "user", content }]);
    setAgentInput("");

    const lower = content.toLowerCase();
    const match: { thinking: string; action?: string; reply: string } =
      agentReplies.find((item) => lower.includes(item.match)) ?? {
      thinking: "Thinking through the input workflow...",
      reply:
        "I can search PubChem, ChEMBL, or DrugBank, fetch 1IEP, validate the SMILES, or prepare a batch screen from the current molecule.",
      };

    setAgentTask(match.thinking);

    window.setTimeout(() => {
      setAgentTask(null);
      setMessages((current) => [
        ...current,
        ...(match.action
          ? [{ id: `act-${Date.now()}`, kind: "action" as const, content: match.action }]
          : []),
        { id: `ai-${Date.now() + 1}`, kind: "ai", content: match.reply },
      ]);

      if (lower.includes("imatinib")) {
        setMolecule(presets[0]);
        setSmiles(presets[0].smiles);
      }
      if (lower.includes("1iep")) {
        setActiveTab("protein");
      }
    }, 900);
  };

  const triggerUpload = () => {
    setUploadState({
      status: "47 molecules loaded · 44 valid · 3 PAINS filtered",
      items: ["Cpd_001 · 312 Da", "Cpd_002 · 428 Da", "Cpd_003 · 198 Da"],
      logLines: [
        "[OK] SDF parsed · 47 records",
        "[OK] 44 passed PAINS filter",
        "[WARN] 3 reactive groups skipped",
        "[INFO] 3D conformers generated via RDKit ETKDGv3",
      ],
    });
  };

  const triggerBatch = () => {
    setBatchProgress(0);
    let value = 0;
    const handle = window.setInterval(() => {
      value = Math.min(100, value + 4);
      setBatchProgress(value);
      if (value >= 100) {
        window.clearInterval(handle);
      }
    }, 100);
  };

  return (
    <section className="screen-shell">
      <div className="app-screen">
        <div className="screen-topbar">
          <div className="sb-title">Input molecule</div>
          <div className="sb-sep" />
          <div className="sb-sub">SMILES · draw · upload · search databases</div>
          <button className="open-agent-btn" type="button" onClick={() => setAgentOpen((open) => !open)}>
            <div className="agent-dot" />
            AlphaDock AI
          </button>
        </div>

        <div className="split-layout">
          <div className={agentOpen ? "main-area agent-open" : "main-area"}>
            <div className="itabs">
              {tabLabels.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={activeTab === key ? "itab on" : "itab"}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="itab-body">
              {activeTab === "smiles" ? (
                <div className="g2">
                  <div>
                    <div className="card">
                      <div className="card-t">Molecule input</div>
                      <div className="lbl">SMILES / name / InChI</div>
                      <textarea value={smiles} onChange={(event) => setSmiles(event.target.value)} />
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--gr)",
                          marginBottom: 8,
                          fontFamily: '"Space Mono", monospace',
                        }}
                      >
                        ✓ Valid · {molecule.mw} Da · {molecule.rot} rot. bonds · Lipinski pass
                      </div>

                      <div className="lbl">Quick load</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                        {presets.map((preset) => (
                          <button
                            key={preset.name}
                            className="btn btn-s"
                            type="button"
                            onClick={() => {
                              setMolecule(preset);
                              setSmiles(preset.smiles);
                            }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>

                      <div className="lbl">Search by name</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="text"
                          value={nameSearch}
                          onChange={(event) => setNameSearch(event.target.value)}
                          placeholder="e.g. gefitinib, aspirin..."
                          style={{ margin: 0, flex: 1 }}
                        />
                        <button className="btn btn-p" type="button">
                          Search
                        </button>
                      </div>
                      {filteredChoices.length ? (
                        <div
                          style={{
                            background: "var(--bg)",
                            border: "1px solid var(--bd)",
                            borderRadius: 7,
                            padding: 5,
                            marginTop: 5,
                          }}
                        >
                          {filteredChoices.map((choice) => (
                            <button
                              key={choice.name}
                              type="button"
                              onClick={() => {
                                setNameSearch(choice.name);
                                setMolecule(presets[0]);
                                setSmiles(presets[0].smiles);
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "5px 7px",
                                border: "none",
                                background: "transparent",
                                color: "var(--txt)",
                                fontSize: 12,
                                borderRadius: 4,
                              }}
                            >
                              <span>{choice.name}</span>
                              <span style={{ color: "var(--mut)" }}>
                                {choice.mw} Da · {choice.target}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="card">
                      <div className="card-t">Lipinski checks</div>
                      <div className="row">
                        <span className="rk">MW ≤ 500</span>
                        <span className="rv g">{molecule.mw} ✓</span>
                      </div>
                      <div className="row">
                        <span className="rk">logP ≤ 5</span>
                        <span className="rv g">{molecule.logp} ✓</span>
                      </div>
                      <div className="row">
                        <span className="rk">HBD ≤ 5</span>
                        <span className="rv g">{molecule.hbd} ✓</span>
                      </div>
                      <div className="row">
                        <span className="rk">HBA ≤ 10</span>
                        <span className="rv g">{molecule.hba} ✓</span>
                      </div>
                      <div className="row">
                        <span className="rk">Rot. bonds</span>
                        <span className="rv a">{molecule.rot} ⚠ flexible</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <MoleculePreview molecule={molecule} />
                    <button
                      className="btn btn-g"
                      type="button"
                      style={{ width: "100%", padding: 10, fontSize: 13 }}
                      onClick={() => navigate("/dock")}
                    >
                      Run docking →
                    </button>
                  </div>
                </div>
              ) : null}

              {activeTab === "protein" ? (
                <div className="g2">
                  <div>
                    <div className="card">
                      <div className="card-t">Protein source</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                        {["Fetch from PDB", "AlphaFold DB (UniProt)", "Upload my own PDB", "Predict from sequence"].map(
                          (label, index) => (
                            <label
                              key={label}
                              style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}
                            >
                              <input type="radio" defaultChecked={index === 0} name="protein-source" />
                              {label}
                            </label>
                          ),
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <input type="text" defaultValue="1IEP" style={{ margin: 0, flex: 1 }} />
                        <button className="btn btn-p" type="button">
                          Fetch
                        </button>
                      </div>
                      <div
                        style={{
                          background: "var(--bg4)",
                          borderRadius: 7,
                          padding: 9,
                          fontSize: 12,
                          color: "var(--mut)",
                          lineHeight: 1.7,
                        }}
                      >
                        <span style={{ color: "var(--ac)", fontWeight: 600 }}>BCR-ABL kinase</span> ·
                        1IEP · 302 res
                        <br />
                        Pocket: ATP-binding · 892 Å³ · <span className="tag tg">Ready</span>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-t">AlphaFold</div>
                      <div style={{ fontSize: 12, color: "var(--mut)", lineHeight: 1.6, marginBottom: 8 }}>
                        For novel targets not in PDB. Paste UniProt ID — AlphaDock fetches the
                        AF2 structure and runs P2Rank pocket detection.
                      </div>
                      <div
                        style={{
                          background: "rgba(255,184,77,.07)",
                          border: "1px solid rgba(255,184,77,.18)",
                          borderRadius: 7,
                          padding: 8,
                          fontSize: 11,
                          color: "var(--am)",
                          marginBottom: 8,
                        }}
                      >
                        AF caveat: apo structure may differ from drug-bound. Regions with pLDDT &lt;
                        70 are flagged.
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="text"
                          placeholder="UniProt e.g. P00519"
                          style={{ margin: 0, flex: 1 }}
                        />
                        <button className="btn btn-p" type="button">
                          Fetch AF
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card">
                      <div className="card-t">Structure quality</div>
                      <div className="row">
                        <span className="rk">Resolution</span>
                        <span className="rv g">2.10 Å</span>
                      </div>
                      <div className="row">
                        <span className="rk">Completeness</span>
                        <span className="rv g">97.3%</span>
                      </div>
                      <div className="row">
                        <span className="rk">Missing residues</span>
                        <span className="rv a">8 (auto-patched)</span>
                      </div>
                      <div className="row">
                        <span className="rk">Protonation</span>
                        <span className="rv g">pH 7.4</span>
                      </div>
                      <div className="row">
                        <span className="rk">Crystal waters</span>
                        <span className="rv">142 included</span>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-t">Pocket detection</div>
                      <select>
                        <option>Auto-detect via P2Rank</option>
                        <option>Around co-crystallised ligand</option>
                        <option>Manual residue selection</option>
                        <option>Blind docking</option>
                      </select>
                      <div style={{ background: "var(--bg4)", borderRadius: 7, padding: 9, fontSize: 12, color: "var(--mut)" }}>
                        Pocket 1: 892 Å³ · score 0.91 <span className="tag tg">selected</span>
                        <br />
                        Pocket 2: 310 Å³ · 0.62
                        <br />
                        Pocket 3: 188 Å³ · 0.41
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "upload" ? (
                <div className="g2">
                  <div>
                    <div className="card">
                      <div className="card-t">Upload ligand file</div>
                      <button className="upload-zone" type="button" onClick={triggerUpload} style={{ width: "100%" }}>
                        <div style={{ fontSize: 28, color: "var(--dim)", marginBottom: 6 }}>↑</div>
                        <div style={{ fontSize: 13, marginBottom: 3 }}>Drop SDF / MOL2 / PDB here</div>
                        <div style={{ fontSize: 11, color: "var(--mut)" }}>or click to browse · max 50 MB</div>
                      </button>
                      {uploadState ? (
                        <div style={{ marginTop: 8, fontSize: 11, color: "var(--gr)" }}>
                          {uploadState.status}
                        </div>
                      ) : null}
                    </div>

                    <div className="card">
                      <div className="card-t">Import from databases</div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Search PubChem, ChEMBL, ZINC..."
                          style={{ margin: 0, flex: 1 }}
                        />
                        <button className="btn btn-p" type="button">
                          Search
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {["PubChem CID", "ChEMBL ID", "ZINC ID", "DrugBank"].map((item) => (
                          <button key={item} className="btn btn-s" type="button" style={{ fontSize: 10 }}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card">
                      <div className="card-t">Uploaded molecules</div>
                      {uploadState ? (
                        uploadState.items.map((item) => (
                          <div key={item} style={{ fontSize: 11, padding: "3px 0", borderBottom: "1px solid var(--bd)", display: "flex", justifyContent: "space-between" }}>
                            <span>{item}</span>
                            <span className="tag tg">Valid</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 12, color: "var(--dim)", padding: "12px 0", textAlign: "center" }}>
                          No files yet
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="card-t">Validation log</div>
                      <div
                        style={{
                          background: "#010508",
                          border: "1px solid var(--bd)",
                          borderRadius: 6,
                          padding: 7,
                          fontFamily: '"Space Mono", monospace',
                          fontSize: 10,
                          minHeight: 70,
                          color: "var(--dim)",
                        }}
                      >
                        {uploadState ? uploadState.logLines.join("\n") : "Waiting for upload..."}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "batch" ? (
                <div className="g2">
                  <div>
                    <div className="card">
                      <div className="card-t">Compound library</div>
                      <button className="upload-zone" type="button" onClick={triggerBatch} style={{ width: "100%", marginBottom: 10 }}>
                        <div style={{ fontSize: 22, color: "var(--dim)", marginBottom: 5 }}>↑</div>
                        <div style={{ fontSize: 12, marginBottom: 2 }}>Drop CSV / SDF library</div>
                        <div style={{ fontSize: 10, color: "var(--mut)" }}>
                          CSV needs SMILES column · max 10,000 compounds
                        </div>
                      </button>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" defaultChecked /> FDA-approved drugs (2,340)
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" /> ZINC drug-like (50k)
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" /> Natural products (30k)
                        </label>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-t">Pre-screen filters</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" defaultChecked /> Lipinski rule of five
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" defaultChecked /> Remove PAINS / reactive
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" /> Similarity ≥ 70% to ref
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="card">
                      <div className="card-t">Batch settings</div>
                      <div className="lbl">Exhaustiveness</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <input type="range" min="4" max="32" defaultValue="8" step="4" style={{ flex: 1 }} />
                        <span style={{ fontFamily: '"Space Mono", monospace', color: "var(--ac)" }}>8</span>
                      </div>
                      <select>
                        <option>AutoDock Vina (fast)</option>
                        <option>GNINA CNN (accurate)</option>
                      </select>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" defaultChecked /> ADMET on all hits
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" defaultChecked /> AI interpretation top 10
                        </label>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <input type="checkbox" /> Resistance panel
                        </label>
                      </div>
                      <button className="btn btn-g" type="button" style={{ width: "100%", padding: 9 }}>
                        Launch batch screen →
                      </button>
                    </div>

                    {batchProgress > 0 ? (
                      <div className="card">
                        <div className="card-t">Batch progress</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--mut)", marginBottom: 3 }}>
                          <span>Screening</span>
                          <span>{batchProgress}%</span>
                        </div>
                        <div className="pbar">
                          <div className="pfill" style={{ width: `${batchProgress}%`, background: "var(--ac)" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 5 }}>
                          Screened: {Math.round((1890 * batchProgress) / 100)}/1890 · Hits:{" "}
                          {Math.round((1890 * batchProgress) / 2500)} · {(batchProgress * 0.11).toFixed(1)}s
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <SimulationAgentSidebar
            open={agentOpen}
            screenKey="input"
            status="● ready · input agent"
            messages={messages}
            task={agentTask}
            suggestions={[
              "Load imatinib from DrugBank",
              "Search BCR-ABL inhibitors",
              "Check ADMET for this SMILES",
              "Fetch protein 1IEP",
            ]}
            inputValue={agentInput}
            inputPlaceholder="Ask the AI agent..."
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
