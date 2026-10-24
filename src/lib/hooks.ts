import { useEffect, useState } from "react";
import type { Trek } from "../data/treks";
import { loadHeightmap, type Heightmap } from "./terrain";
import { buildRoute, type RouteGeometry } from "./route";

export function useHeightmap(id: string): Heightmap | null {
  const [hm, setHm] = useState<Heightmap | null>(null);
  useEffect(() => {
    let live = true;
    loadHeightmap(id).then((h) => live && setHm(h));
    return () => {
      live = false;
    };
  }, [id]);
  return hm;
}

const routeCache = new Map<string, RouteGeometry>();

export function getRoute(trek: Trek, hm: Heightmap): RouteGeometry {
  let r = routeCache.get(trek.id);
  if (!r) {
    r = buildRoute(trek, hm);
    routeCache.set(trek.id, r);
  }
  return r;
}

/** Heightmap + draped route for one trek; null while loading. */
export function useRoute(trek: Trek): { hm: Heightmap; route: RouteGeometry } | null {
  const hm = useHeightmap(trek.id);
  if (!hm) return null;
  return { hm, route: getRoute(trek, hm) };
}

/** Load all treks' routes up-front (for the comparison UI). */
export function useAllRoutes(treks: Trek[]) {
  const [routes, setRoutes] = useState<Record<string, RouteGeometry>>({});
  useEffect(() => {
    let live = true;
    Promise.all(treks.map((t) => loadHeightmap(t.id).then((hm) => [t.id, getRoute(t, hm)] as const))).then(
      (entries) => live && setRoutes(Object.fromEntries(entries)),
    );
    return () => {
      live = false;
    };
  }, [treks]);
  return routes;
}

export function useMedia(query: string) {
  const [m, setM] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
}
