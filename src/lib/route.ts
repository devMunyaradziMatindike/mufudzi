import * as THREE from "three";
import type { Trek } from "../data/treks";
import { haversine, pathLength } from "./geo";
import type { Heightmap } from "./terrain";

/** Scene scale: the terrain tile is SCENE_SIZE units wide regardless of ground size. */
export const SCENE_SIZE = 10;

export interface RouteGeometry {
  /** 3D curve in scene units (x east, y up, z south). */
  curve: THREE.CatmullRomCurve3;
  /** Dense sampled elevation profile in metres. */
  profile: Float32Array;
  distanceM: number;
  gainM: number;
  lossM: number;
  minEle: number;
  maxEle: number;
  /** Scene units per metre of ground. */
  scale: number;
  /** Vertical exaggeration applied to the scene (not to the numbers). */
  exaggeration: number;
  /** Convert metres of elevation into scene Y. */
  eleToY(ele: number): number;
}

/**
 * Densify the hand-traced path, drape it over the heightmap and derive
 * distance and elevation statistics from the result.
 */
export function buildRoute(trek: Trek, hm: Heightmap, exaggeration = 1.6): RouteGeometry {
  const { meta } = hm;
  const scale = SCENE_SIZE / meta.widthM;
  const aspect = meta.heightM / meta.widthM;
  const eleToY = (ele: number) => (ele - meta.minEle) * scale * exaggeration;

  // densify along great-circle-ish straight segments in lon/lat
  const dense: [number, number][] = [];
  const total = pathLength(trek.path);
  const stepM = Math.max(40, total / 400);
  for (let i = 1; i < trek.path.length; i++) {
    const a = trek.path[i - 1];
    const b = trek.path[i];
    const n = Math.max(1, Math.ceil(haversine(a, b) / stepM));
    for (let k = 0; k < n; k++) {
      const f = k / n;
      dense.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
  }
  dense.push(trek.path[trek.path.length - 1]);

  const pts: THREE.Vector3[] = [];
  const raw = new Float32Array(dense.length);
  for (let i = 0; i < dense.length; i++) {
    const [u, v] = hm.project(dense[i][0], dense[i][1]);
    raw[i] = hm.sample(u, v);
  }
  // light smoothing so DEM noise doesn't inflate the ascent total
  const profile = new Float32Array(dense.length);
  const K = 2;
  for (let i = 0; i < raw.length; i++) {
    let s = 0,
      n = 0;
    for (let k = -K; k <= K; k++) {
      const j = i + k;
      if (j >= 0 && j < raw.length) {
        s += raw[j];
        n++;
      }
    }
    profile[i] = s / n;
  }

  let gain = 0,
    loss = 0,
    minEle = Infinity,
    maxEle = -Infinity,
    distance = 0;
  let prevEle = 0;
  for (let i = 0; i < dense.length; i++) {
    const [lon, lat] = dense[i];
    const [u, v] = hm.project(lon, lat);
    const ele = profile[i];
    minEle = Math.min(minEle, ele);
    maxEle = Math.max(maxEle, ele);
    if (i > 0) {
      const d = ele - prevEle;
      if (d > 0) gain += d;
      else loss -= d;
      distance += haversine(dense[i - 1], dense[i]);
    }
    prevEle = ele;
    pts.push(
      new THREE.Vector3(
        (u - 0.5) * SCENE_SIZE,
        eleToY(ele) + 0.015,
        (v - 0.5) * SCENE_SIZE * aspect,
      ),
    );
  }

  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  return {
    curve,
    profile,
    distanceM: distance,
    gainM: gain,
    lossM: loss,
    minEle,
    maxEle,
    scale,
    exaggeration,
    eleToY,
  };
}
