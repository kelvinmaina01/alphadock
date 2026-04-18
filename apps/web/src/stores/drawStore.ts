import { create } from "zustand";

type Atom = { id: string; x: number; y: number; el: string };

type DrawState = { atoms: Atom[]; setAtoms: (atoms: Atom[]) => void };

export const useDrawStore = create<DrawState>((set) => ({
  atoms: [],
  setAtoms: (atoms) => set({ atoms }),
}));
