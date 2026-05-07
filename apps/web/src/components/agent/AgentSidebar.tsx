import { AgentInput } from "./AgentInput";
import { AgentMessages } from "./AgentMessages";
import { AgentSuggestions } from "./AgentSuggestions";
import { getAgentSuggestions, useAgentStore } from "../../stores/agentStore";
import type { ScreenContext } from "../../types/chemistry";

interface AgentSidebarProps {
  screen: ScreenContext;
}

export function AgentSidebar({ screen }: AgentSidebarProps) {
  const { open, typing, messages, pendingTask, setOpen, runMockAgent } =
    useAgentStore();

  return (
    <aside className={`agent-panel ${open ? "is-open" : ""}`}>
      <div className="agent-header">
        <div>
          <p className="eyebrow">AlphaDock AI</p>
          <h3>{screen} agent</h3>
        </div>
        <button className="ghost-button" type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <div className="agent-status">
        <span className="status-dot" />
        ready
      </div>
      <AgentMessages messages={messages} typing={typing} />
      {pendingTask ? <div className="agent-task">{pendingTask}</div> : null}
      <AgentSuggestions
        suggestions={getAgentSuggestions(screen)}
        onPick={runMockAgent}
      />
      <AgentInput onSend={runMockAgent} />
    </aside>
  );
}
