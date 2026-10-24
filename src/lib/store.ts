import { useSyncExternalStore } from "react";
import { TREKS } from "../data/treks";

type Listener = () => void;

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set: (next: T | ((s: T) => T)) => {
      state = typeof next === "function" ? (next as (s: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

/** Index of the trek currently at the front of the turntable. */
export const activeStore = createStore(3); // Kilimanjaro first, like the reference
export const useActiveIndex = () => useSyncExternalStore(activeStore.subscribe, activeStore.get);
export const useActiveTrek = () => TREKS[useActiveIndex()];
export const stepActive = (dir: 1 | -1) =>
  activeStore.set((i) => (i + dir + TREKS.length) % TREKS.length);

/**
 * Mutable, non-reactive scroll progress for the trail flythrough (0..1).
 * Written by ScrollTrigger, read inside useFrame — no React re-renders.
 */
export const scroll = { trail: 0 };
