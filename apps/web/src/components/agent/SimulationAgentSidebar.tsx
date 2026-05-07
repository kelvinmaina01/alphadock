import { useId } from "react";

export interface SimulationAgentMessage {
  id: string;
  kind: "ai" | "user" | "action";
  content: string;
}

interface SimulationAgentSidebarProps {
  open: boolean;
  screenKey: string;
  status: string;
  title?: string;
  messages: SimulationAgentMessage[];
  task?: string | null;
  suggestions: string[];
  inputValue: string;
  inputPlaceholder: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export function SimulationAgentSidebar({
  open,
  screenKey,
  status,
  title = "AlphaDock AI",
  messages,
  task,
  suggestions,
  inputValue,
  inputPlaceholder,
  onInputChange,
  onSubmit,
  onSuggestion,
  onClose,
}: SimulationAgentSidebarProps) {
  const inputId = useId();

  return (
    <aside className={open ? "agent-sidebar open" : "agent-sidebar"} aria-hidden={!open}>
      <div className="agent-header">
        <div className="agent-icon">AI</div>
        <div>
          <div className="agent-name">{title}</div>
          <div className="agent-status">{status}</div>
        </div>
        <button className="agent-close" type="button" onClick={onClose} aria-label="Close agent">
          ×
        </button>
      </div>

      <div className="agent-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.kind === "action"
                ? "msg msg-action"
                : message.kind === "user"
                  ? "msg msg-user"
                  : "msg msg-ai"
            }
          >
            {message.content}
          </div>
        ))}
      </div>

      {task ? (
        <div className="agent-task-bar">
          <div className="task-running">
            <div className="task-dot" />
            <span>{task}</span>
          </div>
        </div>
      ) : null}

      <div className="agent-input-area">
        <div className="agent-suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={`${screenKey}-${suggestion}`}
              type="button"
              className="suggestion"
              onClick={() => onSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="agent-input-row">
          <label className="sr-only" htmlFor={inputId}>
            Ask AlphaDock AI
          </label>
          <input
            id={inputId}
            className="agent-input"
            value={inputValue}
            placeholder={inputPlaceholder}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <button className="agent-send" type="button" onClick={onSubmit}>
            ↑
          </button>
        </div>
      </div>
    </aside>
  );
}
