import type { LonLat } from "../data/treks";

const R = 6371008.8; // mean Earth radius, metres
const toRad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in metres. */
export function haversine(a: LonLat, b: LonLat): number {
  const [lon1, lat1] = a;
  const [lon2, lat2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Total path length in metres. */
export function pathLength(path: LonLat[]): number {
  let d = 0;
  for (let i = 1; i < path.length; i++) d += haversine(path[i - 1], path[i]);
  return d;
}

/** Web Mercator, normalised to 0..1 across the world. */
export function mercator([lon, lat]: LonLat): [number, number] {
  const x = (lon + 180) / 360;
  const s = Math.sin(toRad(lat));
  const y = 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
  return [x, y];
}

export interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export function boundsOf(path: LonLat[], padFrac = 0.25): Bounds {
  let west = Infinity,
    south = Infinity,
    east = -Infinity,
    north = -Infinity;
  for (const [lon, lat] of path) {
    west = Math.min(west, lon);
    east = Math.max(east, lon);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }
  // pad to a square-ish box in mercator space
  const [x0, y0] = mercator([west, north]);
  const [x1, y1] = mercator([east, south]);
  const w = x1 - x0;
  const h = y1 - y0;
  const size = Math.max(w, h) * (1 + padFrac * 2);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return mercatorBounds(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2);
}

export function inverseMercator(x: number, y: number): LonLat {
  const lon = x * 360 - 180;
  const n = Math.PI - 2 * Math.PI * y;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return [lon, lat];
}

export function mercatorBounds(x0: number, y0: number, x1: number, y1: number): Bounds {
  const [west, north] = inverseMercator(x0, y0);
  const [east, south] = inverseMercator(x1, y1);
  return { west, south, east, north };
}

/** Ground width of a bounds box in metres along its central latitude. */
export function boundsWidthMetres(b: Bounds): number {
  const midLat = (b.north + b.south) / 2;
  return haversine([b.west, midLat], [b.east, midLat]);
}

export function boundsHeightMetres(b: Bounds): number {
  const midLon = (b.west + b.east) / 2;
  return haversine([midLon, b.south], [midLon, b.north]);
}

export const fmtMetres = (m: number) =>
  Math.round(m)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f") + "\u202fm";

export const fmtKm = (m: number, digits = 0) => `${(m / 1000).toFixed(digits)} km`;
