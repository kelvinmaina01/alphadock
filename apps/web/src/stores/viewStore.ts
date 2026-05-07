import { create } from "zustand";

type ViewMode = "surface" | "stick" | "sphere" | "ribbon" | "cartoon";

type ViewState = {
  mode: ViewMode;
  showWater: boolean;
  showHbonds: boolean;
  showHydrophobic: boolean;
  showElectrostatic: boolean;
  setMode: (mode: ViewMode) => void;
  toggleWater: () => void;
  toggleHbonds: () => void;
  toggleHydrophobic: () => void;
  toggleElectrostatic: () => void;
};

export const useViewStore = create<ViewState>((set) => ({
  mode: "surface",
  showWater: true,
  showHbonds: true,
  showHydrophobic: true,
  showElectrostatic: false,
  setMode: (mode) => set({ mode }),
  toggleWater: () => set((state) => ({ showWater: !state.showWater })),
  toggleHbonds: () => set((state) => ({ showHbonds: !state.showHbonds })),
  toggleHydrophobic: () =>
    set((state) => ({ showHydrophobic: !state.showHydrophobic })),
  toggleElectrostatic: () =>
    set((state) => ({ showElectrostatic: !state.showElectrostatic })),
}));
