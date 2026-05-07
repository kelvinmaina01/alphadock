import { create } from "zustand";
import { agentSuggestions, createIntroMessages } from "../lib/mocks";
import type { AgentMessage, ScreenContext } from "../types/chemistry";

type AgentState = {
  open: boolean;
  screen: ScreenContext;
  messages: AgentMessage[];
  typing: boolean;
  pendingTask: string | null;
  setOpen: (value: boolean) => void;
  setScreen: (screen: ScreenContext) => void;
  pushUserMessage: (content: string) => void;
  runMockAgent: (content: string) => void;
  resetForScreen: (screen: ScreenContext) => void;
};

function createAssistantResponse(
  screen: ScreenContext,
  content: string,
): { action: string; reply: string } {
  const lower = content.toLowerCase();

  if (lower.includes("imatinib")) {
    return {
      action: 'load_molecule("Imatinib")',
      reply:
        "Imatinib is loaded with a nanomolar-class mock profile. The next useful move is to fetch BCR-ABL and queue a Vina run.",
    };
  }

  if (lower.includes("admet")) {
    return {
      action: 'run_admet("current_molecule")',
      reply:
        "ADMET quick check is favorable overall: high oral exposure, low hERG signal, and a notable CYP3A4 liability worth keeping visible in the UI.",
    };
  }

  if (lower.includes("score")) {
    return {
      action: "explain_score(-9.8)",
      reply:
        "A -9.8 kcal/mol result sits in the excellent range for this interface model and should render as a highly promising hit with clear uncertainty language.",
    };
  }

  if (screen === "draw") {
    return {
      action: 'add_ring("benzene", cx=320, cy=220)',
      reply:
        "I staged a ring-building action for the canvas flow. The draw surface should make atom-by-atom construction feel immediate and controlled.",
    };
  }

  return {
    action: "prepare_next_step()",
    reply:
      "The mocked agent is ready. This first pass is about making the workflow feel real before we wire compute and external services underneath it.",
  };
}

export const useAgentStore = create<AgentState>((set, get) => ({
  open: false,
  screen: "landing",
  messages: createIntroMessages("landing"),
  typing: false,
  pendingTask: null,
  setOpen: (open) => set({ open }),
  setScreen: (screen) => set({ screen }),
  pushUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `user-${Date.now()}`,
          role: "user",
          kind: "message",
          content,
        },
      ],
    })),
  runMockAgent: (content) => {
    get().pushUserMessage(content);
    const { action, reply } = createAssistantResponse(get().screen, content);
    set({ typing: true, pendingTask: `Working: ${action}` });

    window.setTimeout(() => {
      set((state) => ({
        typing: false,
        pendingTask: null,
        messages: [
          ...state.messages,
          {
            id: `action-${Date.now()}`,
            role: "assistant",
            kind: "action",
            content: `[ACTION] ${action} ✓`,
          },
          {
            id: `assistant-${Date.now() + 1}`,
            role: "assistant",
            kind: "message",
            content: reply,
          },
        ],
      }));
    }, 700);
  },
  resetForScreen: (screen) =>
    set({
      screen,
      messages: createIntroMessages(screen),
      typing: false,
      pendingTask: null,
    }),
}));

export function getAgentSuggestions(screen: ScreenContext): string[] {
  return agentSuggestions[screen];
}
