import type { Heightmap } from "../lib/terrain";

/** The terrain tile is SCENE_SIZE scene units wide. */
export const SCENE_SIZE = 10;
export const EXAGGERATION = 1.6;
export const HERD_SIZE = 40;
export const WORLD_LIMIT = 4.7;

export type Vec2 = [number, number];
export type CollarType = "eco" | "evo" | "sat";

export interface CollarSpec {
  name: string;
  tagline: string;
  /** Sim seconds between position fixes (1 sim second ≈ 15 real minutes). */
  fixEvery: number;
  fixLabel: string;
  power: string;
  link: string;
}

export const COLLARS: Record<CollarType, CollarSpec> = {
  eco: { name: "ECO", tagline: "Open pasture", fixEvery: 1, fixLabel: "every 15 min", power: "Solar panel", link: "4G / NB-IoT" },
  evo: { name: "EVO", tagline: "Woodland · low light", fixEvery: 2, fixLabel: "every 30 min", power: "Long-life battery", link: "4G / NB-IoT" },
  sat: { name: "SAT", tagline: "No mobile coverage", fixEvery: 4, fixLabel: "every hour", power: "Solar + satellite", link: "Satellite uplink" },
};

export const WARN_DISTANCE = 0.55;
export const LUX_RADIUS = 1.7;

export interface Animal {
  x: number;
  z: number;
  vx: number;
  vz: number;
  heading: number;
  /** Last transmitted position fix. */
  fixX: number;
  fixZ: number;
  nextFix: number;
  /** 0..1, how loud the collar's progressive alert is. */
  alert: number;
  outside: boolean;
  panic: number;
  palette: number;
  scale: number;
  grazeTimer: number;
  moving: boolean;
}

export interface Predator {
  x: number;
  z: number;
  vx: number;
  vz: number;
  active: boolean;
  state: "hunting" | "fleeing";
  timer: number;
}

export interface Stats {
  total: number;
  inside: number;
  alerts: number;
  breaches: number;
  fixes: number;
  deterred: number;
  attacks: number;
}

export const defaultFence = (): Vec2[] => [
  [-1.7, -1.2],
  [1.8, -1.5],
  [2.0, 1.3],
  [-1.5, 1.7],
];

export function centroid(poly: Vec2[]): Vec2 {
  let x = 0,
    z = 0;
  for (const p of poly) {
    x += p[0];
    z += p[1];
  }
  return [x / poly.length, z / poly.length];
}

export function pointInPolygon([px, pz]: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > pz !== zj > pz && px < ((xj - xi) * (pz - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

export function distanceToEdges([px, pz]: Vec2, poly: Vec2[]): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j];
    const [bx, bz] = poly[i];
    const dx = bx - ax,
      dz = bz - az;
    const len2 = dx * dx + dz * dz || 1e-9;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2));
    const ex = ax + dx * t - px,
      ez = az + dz * t - pz;
    best = Math.min(best, Math.hypot(ex, ez));
  }
  return best;
}

/** Deterministic PRNG so trees and herd colours don't reshuffle on hot reload. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Herd {
  animals: Animal[] = [];
  fence: Vec2[] = defaultFence();
  stats: Stats = { total: HERD_SIZE, inside: HERD_SIZE, alerts: 0, breaches: 0, fixes: 0, deterred: 0, attacks: 0 };
  predator: Predator = { x: 0, z: 0, vx: 0, vz: 0, active: false, state: "hunting", timer: 0 };
  lux: Vec2 = [0.35, 0.15];
  luxFlash = 0;
  time = 0;
  collar: CollarType = "eco";
  night = false;
  luxOn = true;
  private cooldown = 2.5;
  private rand = mulberry32(7);
  readonly aspect: number;
  private readonly scale: number;

  constructor(public hm: Heightmap) {
    this.aspect = hm.meta.heightM / hm.meta.widthM;
    this.scale = SCENE_SIZE / hm.meta.widthM;
    const [cx, cz] = centroid(this.fence);
    for (let i = 0; i < HERD_SIZE; i++) {
      const a = this.rand() * Math.PI * 2;
      const r = Math.sqrt(this.rand()) * 1.0;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      this.animals.push({
        x,
        z,
        vx: 0,
        vz: 0,
        heading: this.rand() * Math.PI * 2,
        fixX: x,
        fixZ: z,
        nextFix: this.rand(),
        alert: 0,
        outside: false,
        panic: 0,
        palette: Math.floor(this.rand() * 5),
        scale: 0.85 + this.rand() * 0.3,
        grazeTimer: this.rand() * 3,
        moving: this.rand() < 0.5,
      });
    }
  }

  /** Scene-space ground height at x,z. */
  heightAt(x: number, z: number): number {
    const u = x / SCENE_SIZE + 0.5;
    const v = z / (SCENE_SIZE * this.aspect) + 0.5;
    const ele = this.hm.sample(Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v)));
    return (ele - this.hm.meta.minEle) * this.scale * EXAGGERATION;
  }

  resetFence() {
    this.fence = defaultFence();
  }

  step(rawDt: number) {
    const dt = Math.min(rawDt, 0.05);
    this.time += dt;
    const spec = COLLARS[this.collar];
    const [cx, cz] = centroid(this.fence);
    const herd = this.animals;

    let hx = 0,
      hz = 0;
    for (const a of herd) {
      hx += a.x;
      hz += a.z;
    }
    hx /= herd.length;
    hz /= herd.length;

    let inside = 0;
    for (const a of herd) {
      // separation / cohesion
      let sx = 0,
        sz = 0;
      for (const b of herd) {
        if (b === a) continue;
        const dx = b.x - a.x,
          dz = b.z - a.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < 0.04) {
          sx -= dx / (d2 + 0.002);
          sz -= dz / (d2 + 0.002);
        }
      }

      // grazing behaviour: stop, nibble, wander
      a.grazeTimer -= dt;
      if (a.grazeTimer <= 0) {
        a.grazeTimer = 1.5 + this.rand() * 4;
        a.moving = this.rand() < 0.55;
        a.heading += (this.rand() - 0.5) * 1.8;
      }
      a.heading += (this.rand() - 0.5) * 0.5 * dt;
      const speed = a.moving ? 0.13 : 0.015;
      let fx = Math.cos(a.heading) * speed;
      let fz = Math.sin(a.heading) * speed;
      fx += sx * 0.0025 + (hx - a.x) * 0.012;
      fz += sz * 0.0025 + (hz - a.z) * 0.012;

      // virtual fence: progressive alert, then turn back
      const p: Vec2 = [a.x, a.z];
      const insideNow = pointInPolygon(p, this.fence);
      let target = 0;
      if (!insideNow) {
        target = 1;
        const dx = cx - a.x,
          dz = cz - a.z;
        const d = Math.hypot(dx, dz) || 1;
        fx += (dx / d) * 0.38;
        fz += (dz / d) * 0.38;
        if (!a.outside) {
          a.outside = true;
          this.stats.breaches++;
        }
      } else {
        a.outside = false;
        inside++;
        const d = distanceToEdges(p, this.fence);
        if (d < WARN_DISTANCE) {
          target = 1 - d / WARN_DISTANCE;
          const dx = cx - a.x,
            dz = cz - a.z;
          const len = Math.hypot(dx, dz) || 1;
          fx += (dx / len) * 0.3 * target * target;
          fz += (dz / len) * 0.3 * target * target;
        }
      }
      const prev = a.alert;
      a.alert += (target - a.alert) * Math.min(1, dt * 4);
      if (prev < 0.5 && a.alert >= 0.5) this.stats.alerts++;

      // panic from a predator
      if (a.panic > 0) {
        const dx = a.x - this.predator.x,
          dz = a.z - this.predator.z;
        const d = Math.hypot(dx, dz) || 1;
        fx += (dx / d) * 0.9 * a.panic;
        fz += (dz / d) * 0.9 * a.panic;
        a.panic = Math.max(0, a.panic - dt * 0.35);
      }

      a.vx += (fx - a.vx) * Math.min(1, dt * 3);
      a.vz += (fz - a.vz) * Math.min(1, dt * 3);
      a.x = Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, a.x + a.vx * dt));
      a.z = Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, a.z + a.vz * dt));
      if (Math.hypot(a.vx, a.vz) > 0.02) a.heading = Math.atan2(a.vz, a.vx);

      // collar fixes
      if (this.time >= a.nextFix) {
        a.fixX = a.x;
        a.fixZ = a.z;
        a.nextFix = this.time + spec.fixEvery * (0.85 + this.rand() * 0.3);
        this.stats.fixes++;
      }
    }
    this.stats.inside = inside;

    this.stepPredator(dt, cx, cz);
    this.luxFlash = Math.max(0, this.luxFlash - dt * 1.2);
  }

  private stepPredator(dt: number, cx: number, cz: number) {
    const p = this.predator;
    if (!this.night) {
      p.active = false;
      this.cooldown = 2.5;
      return;
    }
    if (!p.active) {
      this.cooldown -= dt;
      if (this.cooldown <= 0) {
        const a = this.rand() * Math.PI * 2;
        p.x = Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, cx + Math.cos(a) * 4.3));
        p.z = Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, cz + Math.sin(a) * 4.3));
        p.active = true;
        p.state = "hunting";
        p.timer = 0;
      }
      return;
    }
    if (p.state === "hunting") {
      let best: Animal | null = null,
        bestD = Infinity;
      for (const a of this.animals) {
        const d = Math.hypot(a.x - p.x, a.z - p.z);
        if (d < bestD) {
          bestD = d;
          best = a;
        }
      }
      if (!best) return;
      const dx = best.x - p.x,
        dz = best.z - p.z;
      const d = Math.hypot(dx, dz) || 1;
      p.vx = (dx / d) * 0.5;
      p.vz = (dz / d) * 0.5;

      const dLux = Math.hypot(p.x - this.lux[0], p.z - this.lux[1]);
      if (this.luxOn && dLux < LUX_RADIUS) {
        p.state = "fleeing";
        p.timer = 3.5;
        this.stats.deterred++;
        this.luxFlash = 1;
      } else if (bestD < 0.28) {
        this.stats.attacks++;
        for (const a of this.animals) if (Math.hypot(a.x - p.x, a.z - p.z) < 1.8) a.panic = 1;
        p.state = "fleeing";
        p.timer = 3;
      }
    } else {
      const dx = p.x - cx,
        dz = p.z - cz;
      const d = Math.hypot(dx, dz) || 1;
      p.vx = (dx / d) * 0.9;
      p.vz = (dz / d) * 0.9;
      p.timer -= dt;
      if (p.timer <= 0) {
        p.active = false;
        this.cooldown = 3 + this.rand() * 4;
      }
    }
    p.x += p.vx * dt;
    p.z += p.vz * dt;
  }
}
