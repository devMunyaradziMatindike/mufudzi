import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Trek } from "../data/treks";
import { useRoute } from "../lib/hooks";
import { SCENE_SIZE, type RouteGeometry } from "../lib/route";
import type { Heightmap } from "../lib/terrain";
import { scroll } from "../lib/store";
import { terrainVertex, terrainFragment } from "./shaders";
import { fmtMetres } from "../lib/geo";

const BG = "#070a12";

function Terrain({ hm, route, trek }: { hm: Heightmap; route: RouteGeometry; trek: Trek }) {
  const aspect = hm.meta.heightM / hm.meta.widthM;
  const heightScale = (hm.meta.maxEle - hm.meta.minEle) * route.scale * route.exaggeration;
  const uniforms = useMemo(
    () => ({
      uHeight: { value: hm.texture },
      uHeightScale: { value: heightScale },
      uSteps: { value: 0 },
      uTexel: { value: new THREE.Vector2(1 / hm.meta.width, 1 / hm.meta.height) },
      uSize: { value: new THREE.Vector2(SCENE_SIZE, SCENE_SIZE * aspect) },
      uLight: { value: new THREE.Vector3(-0.5, 0.8, 0.6) },
      uFog: { value: new THREE.Color(BG) },
      uFogNear: { value: 3.5 },
      uFogFar: { value: 11 },
      uMinEle: { value: hm.meta.minEle },
      uMaxEle: { value: hm.meta.maxEle },
      uSnow: { value: Math.max(trek.highPoint.ele - 500, hm.meta.minEle + (hm.meta.maxEle - hm.meta.minEle) * 0.7) },
      uContour: { value: hm.meta.maxEle - hm.meta.minEle > 3000 ? 200 : 100 },
    }),
    [hm, heightScale, trek, aspect],
  );
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[SCENE_SIZE, SCENE_SIZE * aspect, 320, Math.round(320 * aspect)]} />
      <shaderMaterial vertexShader={terrainVertex} fragmentShader={terrainFragment} uniforms={uniforms} />
    </mesh>
  );
}

function RouteTube({ route, color }: { route: RouteGeometry; color: string }) {
  const geom = useMemo(() => new THREE.TubeGeometry(route.curve, 600, 0.009, 8, false), [route]);
  const start = route.curve.getPointAt(0);
  const end = route.curve.getPointAt(1);
  return (
    <group>
      <mesh geometry={geom}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {[start, end].map((p, i) => (
        <mesh key={i} position={[p.x, p.y + 0.02, p.z]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#f3ead8" emissive="#f3ead8" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Walker({ route }: { route: RouteGeometry }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = route.curve.getPointAt(THREE.MathUtils.clamp(scroll.trail, 0, 1));
    ref.current.position.set(p.x, p.y, p.z);
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.14, 6]} />
        <meshBasicMaterial color="#f3ead8" />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#e23b2e" emissive="#e23b2e" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} intensity={0.5} distance={1.2} color="#ffb4a8" />
    </group>
  );
}

function SceneryLabels({ trek, route }: { trek: Trek; route: RouteGeometry }) {
  const [near, setNear] = useState<number>(-1);
  useFrame(() => {
    const p = scroll.trail;
    let best = -1,
      bestD = 0.06;
    trek.scenery.forEach((s, i) => {
      const d = Math.abs(s.t - p);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (best !== near) setNear(best);
  });
  return (
    <>
      {trek.scenery.map((s, i) => {
        const p = route.curve.getPointAt(s.t);
        const on = i === near;
        return (
          <group key={i} position={[p.x, p.y + 0.05, p.z]}>
            <mesh>
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshBasicMaterial color={on ? "#e23b2e" : "#8fa6c4"} />
            </mesh>
            <Html center position={[0, 0.42, 0]} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
              <div className={`scenery ${on ? "scenery-on" : ""}`}>
                <div className="scenery-stem" />
                <div className="scenery-card">
                  <div className="eyebrow !text-[9px]">
                    {String(i + 1).padStart(2, "0")} · {fmtMetres(route.profile[Math.round(s.t * (route.profile.length - 1))])}
                  </div>
                  <div className="font-serif text-xl leading-none text-paper">{s.title}</div>
                  <div className="mt-1 text-[11px] text-paper/70">{s.note}</div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}

/**
 * Camera rig. Scroll progress 0 → overview; a short dive-in; then the camera
 * walks the route behind the walker; pulls back out again at the end.
 */
function CameraRig({ hm, route }: { hm: Heightmap; route: RouteGeometry }) {
  const { camera } = useThree();
  const aspect = hm.meta.heightM / hm.meta.widthM;
  const smooth = useRef(0);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const overview = useMemo(() => new THREE.Vector3(0, 7.5, 8.5), []);
  const overviewLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  const terrainY = (x: number, z: number) => {
    const u = x / SCENE_SIZE + 0.5;
    const v = z / (SCENE_SIZE * aspect) + 0.5;
    return route.eleToY(hm.sample(THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1)));
  };

  useFrame(() => {
    const target = THREE.MathUtils.clamp(scroll.trail, 0, 1);
    smooth.current += (target - smooth.current) * 0.08;
    const p = smooth.current;

    // path-following camera
    const t = THREE.MathUtils.clamp(p, 0, 1);
    const here = route.curve.getPointAt(t);
    const ahead = route.curve.getPointAt(Math.min(1, t + 0.03));
    tmpA.subVectors(here, ahead);
    tmpA.y = 0;
    if (tmpA.lengthSq() < 1e-6) tmpA.set(0, 0, 1);
    tmpA.normalize();
    tmpB.copy(here).addScaledVector(tmpA, 1.15);
    tmpB.y = here.y + 0.55;
    tmpB.y = Math.max(tmpB.y, terrainY(tmpB.x, tmpB.z) + 0.22);
    const followLook = ahead.clone();
    followLook.y += 0.05;

    // blend overview ⇄ follow at both ends
    const dive = THREE.MathUtils.smoothstep(p, 0.0, 0.12);
    const exit = 1 - THREE.MathUtils.smoothstep(p, 0.9, 1.0);
    const k = Math.min(dive, exit);
    pos.lerpVectors(overview, tmpB, k);
    look.lerpVectors(overviewLook, followLook, k);

    camera.position.lerp(pos, 0.15);
    camera.lookAt(look);
  });
  return null;
}

export function TrailFlythrough({ trek, className }: { trek: Trek; className?: string }) {
  const data = useRoute(trek);
  // reset the walker when the trek changes
  useEffect(() => {
    scroll.trail = 0;
  }, [trek.id]);

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 7.5, 8.5], fov: 38, near: 0.05, far: 60 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={[BG]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[-5, 8, 6]} intensity={1.6} />
        {data && (
          <>
            <Terrain hm={data.hm} route={data.route} trek={trek} />
            <RouteTube route={data.route} color={trek.accent} />
            <Walker route={data.route} />
            <SceneryLabels trek={trek} route={data.route} />
            <CameraRig hm={data.hm} route={data.route} />
          </>
        )}
      </Canvas>
    </div>
  );
}
