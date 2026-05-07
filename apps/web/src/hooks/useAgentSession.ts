import { useMemo } from "react";
import { getAgentSuggestions, useAgentStore } from "../stores/agentStore";
import type { ScreenContext } from "../types/chemistry";

export function useAgentSession(screen: ScreenContext) {
  const store = useAgentStore();

  const suggestions = useMemo(() => getAgentSuggestions(screen), [screen]);

  return {
    open: store.open,
    typing: store.typing,
    messages: store.messages,
    pendingTask: store.pendingTask,
    suggestions,
    openPanel: () => store.setOpen(true),
    closePanel: () => store.setOpen(false),
    send: (content: string) => store.runMockAgent(content),
  };
}
