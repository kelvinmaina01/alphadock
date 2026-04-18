import { create } from "zustand";

type ViewState = {
  surfaceMode: "surface" | "stick" | "sphere";
  setSurfaceMode: (m: ViewState["surfaceMode"]) => void;
};

export const useViewStore = create<ViewState>((set) => ({
  surfaceMode: "surface",
  setSurfaceMode: (surfaceMode) => set({ surfaceMode }),
}));
