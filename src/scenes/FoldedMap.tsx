import { useMemo } from "react";
import * as THREE from "three";
import type { Trek } from "../data/treks";
import { useHeightmap } from "../lib/hooks";

/**
 * A closed, folded paper map. The accordion is modelled as a stack of thin
 * leaves with alternating offsets so the fold edges catch the light; the top
 * leaf carries a cover drawn on a canvas from the trek's own heightmap
 * (contour lines) so each card is recognisably its mountain.
 */
export function FoldedMap({ trek, width = 0.9, height = 1.25 }: { trek: Trek; width?: number; height?: number }) {
  const hm = useHeightmap(trek.id);
  const leaves = Math.min(14, 4 + trek.cardsInStack);
  const leafT = 0.014;

  const cover = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 712;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0f1522";
    ctx.fillRect(0, 0, c.width, c.height);

    // contour lines from the heightmap, drawn as iso-bands via marching through rows
    if (hm) {
      const { minEle, maxEle } = hm.meta;
      const img = ctx.createImageData(c.width, c.height);
      const steps = 14;
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const e = hm.sample(x / c.width, y / c.height);
          const n = (e - minEle) / Math.max(1, maxEle - minEle);
          const band = n * steps;
          const f = band - Math.floor(band);
          const line = f < 0.08 ? 1 : 0;
          const i = (y * c.width + x) * 4;
          const base = 22 + n * 30;
          img.data[i] = base + line * 90;
          img.data[i + 1] = base + 4 + line * 80;
          img.data[i + 2] = base + 14 + line * 60;
          img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    // vignette
    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, "rgba(8,11,18,0.1)");
    g.addColorStop(1, "rgba(8,11,18,0.75)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    // typography
    ctx.fillStyle = trek.accent;
    ctx.fillRect(40, 48, 44, 6);
    ctx.fillStyle = "#f3ead8";
    ctx.font = "500 22px 'JetBrains Mono', monospace";
    ctx.fillText(`${trek.index}  ·  ${trek.country.toUpperCase()}`, 40, 96);
    ctx.font = "400 72px 'Instrument Serif', serif";
    wrap(ctx, trek.name, 40, 560, 430, 72);
    ctx.font = "400 22px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(243,234,216,0.75)";
    ctx.fillText(`${trek.days} ${trek.days === 1 ? "DAY" : "DAYS"}   ·   MAX ${trek.highPoint.ele} M`, 40, 660);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [hm, trek]);

  return (
    <group>
      {Array.from({ length: leaves }).map((_, i) => {
        const y = i * leafT;
        const jitter = i % 2 === 0 ? 0 : 0.012;
        const isTop = i === leaves - 1;
        return (
          <mesh key={i} position={[jitter, y, 0]} castShadow={isTop} receiveShadow>
            <boxGeometry args={[width, leafT * 0.92, height]} />
            {isTop ? (
              <meshStandardMaterial map={cover} roughness={0.8} />
            ) : (
              <meshStandardMaterial color={i % 2 ? "#e8e0ce" : "#d8cfbd"} roughness={0.9} />
            )}
          </mesh>
        );
      })}
    </group>
  );
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  const startY = y - (lines.length - 1) * lh;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lh));
}
