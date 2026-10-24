import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { TREKS } from "../data/treks";
import { useActiveIndex } from "../lib/store";

const R = 1;
const toRad = (d: number) => (d * Math.PI) / 180;

/** lon/lat → unit sphere; lon 0 / lat 0 faces +z (the camera). */
export function lonLatToVec(lon: number, lat: number, r = R) {
  const la = toRad(lat),
    lo = toRad(lon);
  return new THREE.Vector3(Math.cos(la) * Math.sin(lo) * r, Math.sin(la) * r, Math.cos(la) * Math.cos(lo) * r);
}

function Land() {
  const [rings, setRings] = useState<number[][][] | null>(null);
  useEffect(() => {
    fetch("/world/land.json").then((r) => r.json()).then(setRings);
  }, []);
  const geom = useMemo(() => {
    if (!rings) return null;
    const pos: number[] = [];
    for (const ring of rings) {
      for (let i = 1; i < ring.length; i++) {
        const a = lonLatToVec(ring[i - 1][0], ring[i - 1][1], R * 1.002);
        const b = lonLatToVec(ring[i][0], ring[i][1], R * 1.002);
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [rings]);
  if (!geom) return null;
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#8fa6c4" transparent opacity={0.55} />
    </lineSegments>
  );
}

function Graticule() {
  const geom = useMemo(() => {
    const pos: number[] = [];
    for (let lat = -60; lat <= 60; lat += 30)
      for (let lon = 0; lon < 360; lon += 4) {
        const a = lonLatToVec(lon, lat, R * 1.001),
          b = lonLatToVec(lon + 4, lat, R * 1.001);
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    for (let lon = 0; lon < 360; lon += 30)
      for (let lat = -90; lat < 90; lat += 4) {
        const a = lonLatToVec(lon, lat, R * 1.001),
          b = lonLatToVec(lon, lat + 4, R * 1.001);
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#3a4b66" transparent opacity={0.35} />
    </lineSegments>
  );
}

function Pin({ lon, lat, active }: { lon: number; lat: number; active: boolean }) {
  const p = useMemo(() => lonLatToVec(lon, lat, R * 1.01), [lon, lat]);
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime % 1.8) / 1.8;
    ring.current.scale.setScalar(active ? 1 + t * 2.2 : 1);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = active ? (1 - t) * 0.7 : 0;
  });
  const n = p.clone().normalize();
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n), [n]);
  return (
    <group position={p} quaternion={q}>
      <mesh>
        <circleGeometry args={[active ? 0.035 : 0.02, 24]} />
        <meshBasicMaterial color={active ? "#e23b2e" : "#f3ead8"} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.035, 0.045, 32]} />
        <meshBasicMaterial color="#e23b2e" transparent opacity={0} />
      </mesh>
    </group>
  );
}

function Sphere() {
  const active = useActiveIndex();
  const group = useRef<THREE.Group>(null);
  const spin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const t = TREKS[active];
    // centroid of the route
    const lon = t.path.reduce((s, p) => s + p[0], 0) / t.path.length;
    const lat = t.path.reduce((s, p) => s + p[1], 0) / t.path.length;
    const targetY = -toRad(lon);
    // shortest way round
    const cur = spin.current.y;
    const delta = ((targetY - cur + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    gsap.to(spin.current, { y: cur + delta, x: toRad(lat) * 0.9, duration: 1.4, ease: "power3.inOut" });
  }, [active]);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.set(spin.current.x, spin.current.y, 0);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color="#111a2b" roughness={0.9} metalness={0.1} />
      </mesh>
      <Graticule />
      <Land />
      {TREKS.map((t, i) => {
        const lon = t.path.reduce((s, p) => s + p[0], 0) / t.path.length;
        const lat = t.path.reduce((s, p) => s + p[1], 0) / t.path.length;
        return <Pin key={t.id} lon={lon} lat={lat} active={i === active} />;
      })}
    </group>
  );
}

/** Soft halo: a camera-facing ring whose alpha peaks just outside the limb and fades out. */
function Atmosphere() {
  const { camera } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color("#5b86c9") }, uInner: { value: R * 0.985 }, uOuter: { value: R * 1.4 } },
        vertexShader: /* glsl */ `
          varying vec2 vP;
          void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uInner; uniform float uOuter; varying vec2 vP;
          void main(){
            float r = length(vP);
            float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
            float a = pow(1.0 - t, 2.6) * 0.75;
            gl_FragColor = vec4(uColor, a);
          }`,
      }),
    [],
  );
  useFrame(() => ref.current?.quaternion.copy(camera.quaternion));
  return (
    <mesh ref={ref} material={mat}>
      <ringGeometry args={[R * 0.985, R * 1.4, 96]} />
    </mesh>
  );
}

export function Globe({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas camera={{ position: [0, 0.2, 3.1], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-3, 2, 4]} intensity={2.2} color="#dfe8ff" />
        <directionalLight position={[3, -1, -2]} intensity={0.4} color="#5b86c9" />
        <Sphere />
        <Atmosphere />
      </Canvas>
    </div>
  );
}
