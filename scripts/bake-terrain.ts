/**
 * Bake per-trek heightmaps from the public AWS Terrain Tiles dataset
 * (Terrarium PNG encoding, no API key) into public/terrain/<id>.png + .json,
 * and the Natural Earth land outlines into public/world/land.json.
 *
 *   npm run bake:terrain
 *
 * Tiles are cached under .cache/ so re-runs are cheap.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { PNG } from "pngjs";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { TREKS } from "../src/data/treks";
import {
  boundsOf,
  mercator,
  boundsWidthMetres,
  boundsHeightMetres,
} from "../src/lib/geo";

const TILE_URL = (z: number, x: number, y: number) =>
  `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
const OUT_SIZE = 512;
const MAX_ZOOM = 14;
const CACHE = ".cache/tiles";
const OUT = "public/terrain";

const decode = (r: number, g: number, b: number) => r * 256 + g + b / 256 - 32768;

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchTile(z: number, x: number, y: number): Promise<PNG> {
  const file = `${CACHE}/${z}-${x}-${y}.png`;
  let buf: Buffer;
  if (await exists(file)) {
    buf = await readFile(file);
  } else {
    const res = await fetch(TILE_URL(z, x, y));
    if (!res.ok) throw new Error(`tile ${z}/${x}/${y} -> ${res.status}`);
    buf = Buffer.from(await res.arrayBuffer());
    await writeFile(file, buf);
  }
  return PNG.sync.read(buf);
}

async function bakeTrek(trek: (typeof TREKS)[number]) {
  const bounds = boundsOf(trek.path, 0.22);
  const [mx0, my0] = mercator([bounds.west, bounds.north]);
  const [mx1, my1] = mercator([bounds.east, bounds.south]);
  const fracW = mx1 - mx0;
  // pick the zoom at which the box spans ≈ OUT_SIZE source pixels
  const zoom = Math.min(MAX_ZOOM, Math.max(1, Math.round(Math.log2(OUT_SIZE / (256 * fracW)))));
  const world = 256 * 2 ** zoom;
  const px0 = mx0 * world,
    py0 = my0 * world,
    px1 = mx1 * world,
    py1 = my1 * world;
  const tx0 = Math.floor(px0 / 256),
    ty0 = Math.floor(py0 / 256);
  const tx1 = Math.floor((px1 - 1e-6) / 256),
    ty1 = Math.floor((py1 - 1e-6) / 256);

  const tilesW = tx1 - tx0 + 1,
    tilesH = ty1 - ty0 + 1;
  const mosaicW = tilesW * 256,
    mosaicH = tilesH * 256;
  const mosaic = new Float32Array(mosaicW * mosaicH);

  const jobs: Promise<void>[] = [];
  for (let ty = ty0; ty <= ty1; ty++)
    for (let tx = tx0; tx <= tx1; tx++)
      jobs.push(
        fetchTile(zoom, tx, ty).then((png) => {
          const ox = (tx - tx0) * 256,
            oy = (ty - ty0) * 256;
          for (let y = 0; y < 256; y++)
            for (let x = 0; x < 256; x++) {
              const i = (y * 256 + x) * 4;
              mosaic[(oy + y) * mosaicW + ox + x] = decode(
                png.data[i],
                png.data[i + 1],
                png.data[i + 2],
              );
            }
        }),
      );
  await Promise.all(jobs);

  // crop + resample to OUT_SIZE x OUT_H (mercator box is square-ish)
  const outW = OUT_SIZE;
  const outH = Math.round((OUT_SIZE * (py1 - py0)) / (px1 - px0));
  const out = new Float32Array(outW * outH);
  let minEle = Infinity,
    maxEle = -Infinity;
  const sample = (x: number, y: number) => {
    const cx = Math.min(mosaicW - 1.001, Math.max(0, x)),
      cy = Math.min(mosaicH - 1.001, Math.max(0, y));
    const x0 = Math.floor(cx),
      y0 = Math.floor(cy),
      fx = cx - x0,
      fy = cy - y0;
    const i = y0 * mosaicW + x0;
    return (
      (mosaic[i] * (1 - fx) + mosaic[i + 1] * fx) * (1 - fy) +
      (mosaic[i + mosaicW] * (1 - fx) + mosaic[i + mosaicW + 1] * fx) * fy
    );
  };
  for (let y = 0; y < outH; y++)
    for (let x = 0; x < outW; x++) {
      const sx = px0 - tx0 * 256 + ((x + 0.5) / outW) * (px1 - px0);
      const sy = py0 - ty0 * 256 + ((y + 0.5) / outH) * (py1 - py0);
      // clamp bathymetry to sea level and keep 1 m precision (compresses far better)
      const h = Math.max(0, Math.round(sample(sx, sy)));
      out[y * outW + x] = h;
      minEle = Math.min(minEle, h);
      maxEle = Math.max(maxEle, h);
    }

  const png = new PNG({ width: outW, height: outH });
  for (let i = 0; i < out.length; i++) {
    const v = out[i] + 32768;
    const r = Math.floor(v / 256);
    const g = Math.floor(v - r * 256);
    const b = 0;
    png.data[i * 4] = r;
    png.data[i * 4 + 1] = g;
    png.data[i * 4 + 2] = b;
    png.data[i * 4 + 3] = 255;
  }
  await writeFile(`${OUT}/${trek.id}.png`, PNG.sync.write(png));
  const meta = {
    ...bounds,
    width: outW,
    height: outH,
    minEle: Math.round(minEle),
    maxEle: Math.round(maxEle),
    widthM: Math.round(boundsWidthMetres(bounds)),
    heightM: Math.round(boundsHeightMetres(bounds)),
    zoom,
    source: "AWS Terrain Tiles (Mapzen Terrarium), https://registry.opendata.aws/terrain-tiles/",
  };
  await writeFile(`${OUT}/${trek.id}.json`, JSON.stringify(meta, null, 2));
  console.log(
    `${trek.id.padEnd(12)} z${zoom} ${tilesW}x${tilesH} tiles -> ${outW}x${outH}  ${meta.minEle}–${meta.maxEle} m  ${(meta.widthM / 1000).toFixed(1)} km wide`,
  );
}

async function bakeWorld() {
  const file = "public/world/land.json";
  if (await exists(file)) return;
  const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json");
  const topo = (await res.json()) as Topology<{ land: GeometryCollection }>;
  const land = topojson.feature(topo, topo.objects.land);
  // keep only coordinate rings, rounded, to keep the file small
  const rings: number[][][] = [];
  for (const f of land.features) {
    const g = f.geometry;
    const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
    for (const poly of polys)
      for (const ring of poly) rings.push(ring.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]));
  }
  await mkdir("public/world", { recursive: true });
  await writeFile(file, JSON.stringify(rings));
  console.log(`world        ${rings.length} land rings`);
}

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });
await bakeWorld();
for (const trek of TREKS) await bakeTrek(trek);
