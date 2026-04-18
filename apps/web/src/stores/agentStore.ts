import { create } from "zustand";

type AgentState = { open: boolean; setOpen: (v: boolean) => void };

export const useAgentStore = create<AgentState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
