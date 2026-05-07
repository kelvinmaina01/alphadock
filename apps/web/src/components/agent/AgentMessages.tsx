import type { AgentMessage } from "../../types/chemistry";

interface AgentMessagesProps {
  messages: AgentMessage[];
  typing: boolean;
}

export function AgentMessages({ messages, typing }: AgentMessagesProps) {
  return (
    <div className="agent-messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.kind === "action"
              ? "agent-action"
              : message.role === "user"
                ? "agent-bubble agent-bubble-user"
                : "agent-bubble agent-bubble-assistant"
          }
        >
          {message.content}
        </div>
      ))}
      {typing ? (
        <div className="agent-typing">
          <span />
          <span />
          <span />
        </div>
      ) : null}
    </div>
  );
}
