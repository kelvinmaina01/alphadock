import { useState } from "react";

interface AgentInputProps {
  onSend: (message: string) => void;
}

export function AgentInput({ onSend }: AgentInputProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div className="agent-input-wrap">
      <textarea
        className="agent-input"
        placeholder="Ask the AI agent..."
        rows={3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="agent-send" type="button" onClick={submit}>
        Send
      </button>
    </div>
  );
}
