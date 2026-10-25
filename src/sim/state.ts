import { createStore, useStore } from "../lib/store";
import type { CollarType, Herd } from "./herd";

export interface Settings {
  collar: CollarType;
  night: boolean;
  lux: boolean;
}

export const settings = createStore<Settings>({ collar: "eco", night: false, lux: true });
export const useSettings = () => useStore(settings);
export const patchSettings = (p: Partial<Settings>) => settings.set((s) => ({ ...s, ...p }));

/** Bumped whenever the fence polygon changes so 3D geometry rebuilds. */
export const fenceVersion = createStore(0);
export const bumpFence = () => fenceVersion.set((v) => v + 1);

/** The live simulation instance, set by the Pasture scene once terrain loads. */
export const sim: { herd: Herd | null } = { herd: null };

export function resetFence() {
  sim.herd?.resetFence();
  bumpFence();
}
