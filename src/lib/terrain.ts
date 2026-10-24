import * as THREE from "three";
import { mercator, type Bounds } from "./geo";

export interface TerrainMeta extends Bounds {
  width: number;
  height: number;
  minEle: number;
  maxEle: number;
  /** ground size of the tile in metres */
  widthM: number;
  heightM: number;
  zoom: number;
}

export interface Heightmap {
  meta: TerrainMeta;
  data: Float32Array;
  texture: THREE.DataTexture;
  /** Sample elevation in metres at normalised u,v (0..1, v down) with bilinear filtering. */
  sample(u: number, v: number): number;
  /** Project lon/lat to normalised tile uv (v grows downward like the image). */
  project(lon: number, lat: number): [number, number];
}

/** Terrarium encoding: h = R*256 + G + B/256 - 32768 */
export function decodeTerrarium(r: number, g: number, b: number): number {
  return r * 256 + g + b / 256 - 32768;
}

const cache = new Map<string, Promise<Heightmap>>();

export function loadHeightmap(id: string): Promise<Heightmap> {
  if (!cache.has(id)) cache.set(id, fetchHeightmap(id));
  return cache.get(id)!;
}

async function fetchHeightmap(id: string): Promise<Heightmap> {
  const [meta, img] = await Promise.all([
    fetch(`/terrain/${id}.json`).then((r) => r.json() as Promise<TerrainMeta>),
    loadImage(`/terrain/${id}.png`),
  ]);
  const { width, height } = meta;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, width, height).data;
  const data = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    data[i] = decodeTerrarium(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  }

  // Normalised height texture for the GPU (0..1 between min/max)
  const range = Math.max(1, meta.maxEle - meta.minEle);
  const norm = new Float32Array(width * height);
  for (let i = 0; i < norm.length; i++) norm[i] = (data[i] - meta.minEle) / range;
  const texture = new THREE.DataTexture(norm, width, height, THREE.RedFormat, THREE.FloatType);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = false;
  texture.needsUpdate = true;

  const [mx0, my0] = mercator([meta.west, meta.north]);
  const [mx1, my1] = mercator([meta.east, meta.south]);

  const sample = (u: number, v: number) => {
    const x = Math.min(width - 1.001, Math.max(0, u * (width - 1)));
    const y = Math.min(height - 1.001, Math.max(0, v * (height - 1)));
    const x0 = Math.floor(x),
      y0 = Math.floor(y);
    const fx = x - x0,
      fy = y - y0;
    const i00 = y0 * width + x0;
    const h00 = data[i00],
      h10 = data[i00 + 1],
      h01 = data[i00 + width],
      h11 = data[i00 + width + 1];
    return (h00 * (1 - fx) + h10 * fx) * (1 - fy) + (h01 * (1 - fx) + h11 * fx) * fy;
  };

  const project = (lon: number, lat: number): [number, number] => {
    const [mx, my] = mercator([lon, lat]);
    return [(mx - mx0) / (mx1 - mx0), (my - my0) / (my1 - my0)];
  };

  return { meta, data, texture, sample, project };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
