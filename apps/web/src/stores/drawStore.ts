import { create } from "zustand";
import { defaultSmiles } from "../lib/mocks";

export interface Atom {
  id: number;
  x: number;
  y: number;
  element: string;
}

export interface Bond {
  id: number;
  atom1: number;
  atom2: number;
  type: "single" | "double" | "aromatic";
}

type DrawState = {
  atoms: Atom[];
  bonds: Bond[];
  selectedAtom: number | null;
  activeElement: string;
  activeBondType: Bond["type"];
  smiles: string;
  addAtom: (atom: Omit<Atom, "id">) => void;
  addBond: (bond: Omit<Bond, "id">) => void;
  selectAtom: (id: number | null) => void;
  setElement: (element: string) => void;
  setBondType: (type: Bond["type"]) => void;
  setSmiles: (smiles: string) => void;
  clear: () => void;
};

export const useDrawStore = create<DrawState>((set, get) => ({
  atoms: [
    { id: 1, x: 180, y: 180, element: "C" },
    { id: 2, x: 240, y: 150, element: "N" },
    { id: 3, x: 300, y: 180, element: "C" },
  ],
  bonds: [
    { id: 1, atom1: 1, atom2: 2, type: "single" },
    { id: 2, atom1: 2, atom2: 3, type: "double" },
  ],
  selectedAtom: null,
  activeElement: "C",
  activeBondType: "single",
  smiles: defaultSmiles,
  addAtom: (atom) =>
    set((state) => ({
      atoms: [...state.atoms, { ...atom, id: state.atoms.length + 1 }],
    })),
  addBond: (bond) =>
    set((state) => ({
      bonds: [...state.bonds, { ...bond, id: state.bonds.length + 1 }],
    })),
  selectAtom: (selectedAtom) => set({ selectedAtom }),
  setElement: (activeElement) => set({ activeElement }),
  setBondType: (activeBondType) => set({ activeBondType }),
  setSmiles: (smiles) => set({ smiles }),
  clear: () => {
    const current = get().activeElement;
    set({
      atoms: [],
      bonds: [],
      selectedAtom: null,
      smiles: "",
      activeElement: current,
      activeBondType: "single",
    });
  },
}));
