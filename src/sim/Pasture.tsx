import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { PASTURE } from "../data/regions";
import { useHeightmap } from "../lib/hooks";
import type { Heightmap } from "../lib/terrain";
import { useStore } from "../lib/store";
import { Herd, HERD_SIZE, LUX_RADIUS, SCENE_SIZE, EXAGGERATION, WORLD_LIMIT, mulberry32, type Vec2 } from "./herd";
import { settings, sim, fenceVersion, bumpFence } from "./state";
import { terrainVertex, pastureFragment } from "./shaders";

const DAY_SKY = new THREE.Color("#dfe9f1");
const NIGHT_SKY = new THREE.Color("#0a1222");
const GREEN = "#82b718";
const ORANGE = "#ff6900";

/** Smoothed 0..1 night factor shared by the scene. */
const nightRef = { v: 0 };

/* ------------------------------------------------------------------ */

function Terrain({ hm, herd }: { hm: Heightmap; herd: Herd }) {
  const aspect = herd.aspect;
  const heightScale = (hm.meta.maxEle - hm.meta.minEle) * (SCENE_SIZE / hm.meta.widthM) * EXAGGERATION;
  const uniforms = useMemo(
    () => ({
      uHeight: { value: hm.texture },
      uHeightScale: { value: heightScale },
      uTexel: { value: new THREE.Vector2(1 / hm.meta.width, 1 / hm.meta.height) },
      uSize: { value: new THREE.Vector2(SCENE_SIZE, SCENE_SIZE * aspect) },
      uLight: { value: new THREE.Vector3(-0.5, 0.9, 0.6) },
      uNight: { value: 0 },
      uFog: { value: DAY_SKY.clone() },
      uFogNear: { value: 9 },
      uFogFar: { value: 20 },
    }),
    [hm, heightScale, aspect],
  );
  useFrame(() => {
    uniforms.uNight.value = nightRef.v;
    uniforms.uFog.value.lerpColors(DAY_SKY, NIGHT_SKY, nightRef.v);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[SCENE_SIZE, SCENE_SIZE * aspect, 256, Math.round(256 * aspect)]} />
      <shaderMaterial vertexShader={terrainVertex} fragmentShader={pastureFragment} uniforms={uniforms} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */

const PALETTE = ["#6b4a2b", "#8c5a33", "#1c1a19", "#c9a985", "#e8dfd0"].map((c) => new THREE.Color(c));
const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();
const ALERT_OK = new THREE.Color(GREEN);
const ALERT_WARN = new THREE.Color("#f5a623");
const ALERT_OUT = new THREE.Color("#dc3232");

function cowGeometry() {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.BoxGeometry(0.26, 0.13, 0.12);
  body.translate(0, 0.17, 0);
  parts.push(body);
  const head = new THREE.BoxGeometry(0.09, 0.08, 0.08);
  head.translate(0.16, 0.2, 0);
  parts.push(head);
  for (const [x, z] of [
    [0.09, 0.04],
    [0.09, -0.04],
    [-0.09, 0.04],
    [-0.09, -0.04],
  ]) {
    const leg = new THREE.BoxGeometry(0.03, 0.11, 0.03);
    leg.translate(x, 0.055, z);
    parts.push(leg);
  }
  return mergeGeometries(parts)!;
}

function Animals({ herd }: { herd: Herd }) {
  const bodies = useRef<THREE.InstancedMesh>(null);
  const collars = useRef<THREE.InstancedMesh>(null);
  const fixes = useRef<THREE.InstancedMesh>(null);
  const rings = useRef<THREE.InstancedMesh>(null);
  const geom = useMemo(cowGeometry, []);

  useEffect(() => {
    const b = bodies.current;
    if (!b) return;
    herd.animals.forEach((a, i) => b.setColorAt(i, PALETTE[a.palette]));
    if (b.instanceColor) b.instanceColor.needsUpdate = true;
  }, [herd]);

  useFrame(() => {
    const b = bodies.current,
      c = collars.current,
      f = fixes.current,
      r = rings.current;
    if (!b || !c || !f || !r) return;
    herd.animals.forEach((a, i) => {
      const y = herd.heightAt(a.x, a.z);
      dummy.position.set(a.x, y, a.z);
      dummy.rotation.set(0, -a.heading, 0);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      b.setMatrixAt(i, dummy.matrix);
      dummy.position.set(a.x + Math.cos(a.heading) * 0.14 * a.scale, y + 0.2 * a.scale, a.z + Math.sin(a.heading) * 0.14 * a.scale);
      dummy.updateMatrix();
      c.setMatrixAt(i, dummy.matrix);

      // last transmitted fix, floating above where the collar *thinks* the animal is
      const fy = herd.heightAt(a.fixX, a.fixZ);
      const pulse = 1 + a.alert * 0.6;
      dummy.position.set(a.fixX, fy + 0.5, a.fixZ);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      f.setMatrixAt(i, dummy.matrix);
      if (a.outside) tmpColor.copy(ALERT_OUT);
      else tmpColor.lerpColors(ALERT_OK, ALERT_WARN, Math.min(1, a.alert * 1.4));
      f.setColorAt(i, tmpColor);

      // audible-alert ring on the ground
      dummy.position.set(a.x, y + 0.01, a.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      const s = a.alert > 0.08 ? 0.25 + a.alert * 0.5 : 0.0001;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      r.setMatrixAt(i, dummy.matrix);
      r.setColorAt(i, a.outside ? ALERT_OUT : ALERT_WARN);
    });
    b.instanceMatrix.needsUpdate = true;
    c.instanceMatrix.needsUpdate = true;
    f.instanceMatrix.needsUpdate = true;
    r.instanceMatrix.needsUpdate = true;
    if (f.instanceColor) f.instanceColor.needsUpdate = true;
    if (r.instanceColor) r.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={bodies} args={[geom, undefined, HERD_SIZE]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={collars} args={[undefined, undefined, HERD_SIZE]} frustumCulled={false}>
        <boxGeometry args={[0.035, 0.05, 0.1]} />
        <meshStandardMaterial color={GREEN} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={fixes} args={[undefined, undefined, HERD_SIZE]} frustumCulled={false}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial />
      </instancedMesh>
      <instancedMesh ref={rings} args={[undefined, undefined, HERD_SIZE]} frustumCulled={false}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial transparent opacity={0.55} depthWrite={false} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Fence({ herd, onDragChange }: { herd: Herd; onDragChange: (d: boolean) => void }) {
  const version = useStore(fenceVersion);
  const drag = useRef<number | null>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const f = herd.fence;
    for (let i = 0; i < f.length; i++) {
      const a = f[i],
        b = f[(i + 1) % f.length];
      const n = 24;
      for (let k = 0; k < n; k++) {
        const t = k / n;
        const x = a[0] + (b[0] - a[0]) * t,
          z = a[1] + (b[1] - a[1]) * t;
        pts.push(new THREE.Vector3(x, herd.heightAt(x, z) + 0.03, z));
      }
    }
    pts.push(pts[0].clone());
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [herd, version]);

  useEffect(() => {
    const up = () => {
      if (drag.current !== null) {
        drag.current = null;
        onDragChange(false);
      }
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [onDragChange]);

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (drag.current === null) return;
    const lim = WORLD_LIMIT - 0.3;
    herd.fence[drag.current] = [
      Math.max(-lim, Math.min(lim, e.point.x)),
      Math.max(-lim, Math.min(lim, e.point.z)),
    ];
    bumpFence();
  };

  const avgY = herd.fence.reduce((s, [x, z]) => s + herd.heightAt(x, z), 0) / herd.fence.length;

  return (
    <group>
      <Line points={points} color={ORANGE} lineWidth={2.5} dashed dashSize={0.12} gapSize={0.07} />
      {/* drag plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, avgY + 0.3, 0]} onPointerMove={onMove}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {herd.fence.map(([x, z], i) => {
        const y = herd.heightAt(x, z);
        return (
          <group key={i} position={[x, y, z]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
              <meshStandardMaterial color="#f1f1f1" />
            </mesh>
            <mesh
              position={[0, 0.42, 0]}
              onPointerDown={(e) => {
                e.stopPropagation();
                drag.current = i;
                onDragChange(true);
              }}
              onPointerOver={() => (document.body.style.cursor = "grab")}
              onPointerOut={() => (document.body.style.cursor = "")}
            >
              <sphereGeometry args={[0.09, 20, 20]} />
              <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={0.35} roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */

function LuxUnit({ herd }: { herd: Herd }) {
  const lamp = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [x, z] = herd.lux;
  const y = herd.heightAt(x, z);
  useFrame(({ clock }) => {
    const on = herd.luxOn ? 1 : 0;
    const n = nightRef.v;
    const flash = herd.luxFlash;
    const strobe = flash > 0 ? (Math.sin(clock.elapsedTime * 40) > 0 ? 1 : 0.2) : 1;
    if (lamp.current) {
      const m = lamp.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = on * (0.3 + n * 2.5) * strobe;
    }
    if (light.current) light.current.intensity = on * n * (3 + flash * 14) * strobe;
    if (ring.current) {
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = on * n * (0.18 + flash * 0.4);
      ring.current.visible = m.opacity > 0.01;
    }
  });
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 10]} />
        <meshStandardMaterial color="#565656" />
      </mesh>
      <mesh position={[0, 0.72, 0]} ref={lamp}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fff6d6" emissive="#fff1b8" emissiveIntensity={0.3} />
      </mesh>
      <pointLight ref={light} position={[0, 0.8, 0]} color="#ffe9a8" distance={LUX_RADIUS * 1.6} decay={1.5} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[LUX_RADIUS - 0.03, LUX_RADIUS, 96]} />
        <meshBasicMaterial color="#ffe9a8" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PredatorMesh({ herd }: { herd: Herd }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    const p = herd.predator;
    if (!g.current) return;
    g.current.visible = p.active;
    if (!p.active) return;
    g.current.position.set(p.x, herd.heightAt(p.x, p.z), p.z);
    g.current.rotation.y = -Math.atan2(p.vz, p.vx);
  });
  return (
    <group ref={g} visible={false}>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.28, 0.1, 0.09]} />
        <meshStandardMaterial color="#2a2a2e" />
      </mesh>
      <mesh position={[0.16, 0.15, 0]}>
        <boxGeometry args={[0.09, 0.07, 0.07]} />
        <meshStandardMaterial color="#2a2a2e" />
      </mesh>
      {[-0.025, 0.025].map((z) => (
        <mesh key={z} position={[0.205, 0.165, z]}>
          <sphereGeometry args={[0.009, 6, 6]} />
          <meshBasicMaterial color="#ffd166" />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Trees({ herd }: { herd: Herd }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const spots = useMemo(() => {
    const rand = mulberry32(42);
    const out: { x: number; z: number; s: number }[] = [];
    let guard = 0;
    while (out.length < 46 && guard++ < 600) {
      const x = (rand() - 0.5) * 9.2,
        z = (rand() - 0.5) * 9.2 * herd.aspect;
      if (Math.abs(x) < 2.6 && Math.abs(z) < 2.3) continue; // keep the default paddock clear
      out.push({ x, z, s: 0.7 + rand() * 0.7 });
    }
    return out;
  }, [herd]);

  useEffect(() => {
    const t = trunks.current,
      c = crowns.current;
    if (!t || !c) return;
    spots.forEach((p, i) => {
      const y = herd.heightAt(p.x, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(p.s);
      dummy.position.set(p.x, y + 0.15 * p.s, p.z);
      dummy.updateMatrix();
      t.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p.x, y + 0.42 * p.s, p.z);
      dummy.updateMatrix();
      c.setMatrixAt(i, dummy.matrix);
    });
    t.instanceMatrix.needsUpdate = true;
    c.instanceMatrix.needsUpdate = true;
  }, [spots, herd]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, spots.length]}>
        <cylinderGeometry args={[0.03, 0.05, 0.3, 7]} />
        <meshStandardMaterial color="#5a4632" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, spots.length]}>
        <sphereGeometry args={[0.26, 10, 8]} />
        <meshStandardMaterial color="#3f5a26" roughness={1} />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Atmosphere() {
  const { scene } = useThree();
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const fog = useMemo(() => new THREE.Fog(DAY_SKY.clone(), 9, 20), []);
  useEffect(() => {
    scene.fog = fog;
    scene.background = DAY_SKY.clone();
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  useFrame(() => {
    const n = nightRef.v;
    (scene.background as THREE.Color).lerpColors(DAY_SKY, NIGHT_SKY, n);
    fog.color.lerpColors(DAY_SKY, NIGHT_SKY, n);
    if (hemi.current) hemi.current.intensity = 0.9 - n * 0.75;
    if (sun.current) sun.current.intensity = 2.4 - n * 2.2;
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#e8f0ff", "#6b7a4a", 0.9]} />
      <directionalLight ref={sun} position={[-6, 9, 5]} intensity={2.4} color="#fff3df" />
    </>
  );
}

function Simulation({ herd }: { herd: Herd }) {
  useEffect(() => {
    sim.herd = herd;
    return () => {
      if (sim.herd === herd) sim.herd = null;
    };
  }, [herd]);
  useFrame((_, dt) => {
    const s = settings.get();
    herd.collar = s.collar;
    herd.night = s.night;
    herd.luxOn = s.lux;
    nightRef.v += ((s.night ? 1 : 0) - nightRef.v) * Math.min(1, dt * 2.5);
    herd.step(dt);
  });
  return null;
}

function Scene({ hm }: { hm: Heightmap }) {
  const herd = useMemo(() => new Herd(hm), [hm]);
  const [dragging, setDragging] = useState(false);
  const [cx, cz] = useMemo(() => herd.fence.reduce<Vec2>((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]), [herd]);
  return (
    <>
      <Atmosphere />
      <Simulation herd={herd} />
      <Terrain hm={hm} herd={herd} />
      <Trees herd={herd} />
      <Fence herd={herd} onDragChange={setDragging} />
      <Animals herd={herd} />
      <LuxUnit herd={herd} />
      <PredatorMesh herd={herd} />
      <OrbitControls
        enabled={!dragging}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.55}
        maxPolarAngle={1.3}
        target={[cx, herd.heightAt(cx, cz) + 0.2, cz]}
        makeDefault
      />
    </>
  );
}

export function Pasture({ className }: { className?: string }) {
  const hm = useHeightmap(PASTURE.id);
  return (
    <div className={className}>
      <Canvas camera={{ position: [1.5, 4.6, 7.2], fov: 40, near: 0.1, far: 80 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        {hm && <Scene hm={hm} />}
      </Canvas>
    </div>
  );
}
