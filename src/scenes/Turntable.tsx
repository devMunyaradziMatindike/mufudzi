import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { TREKS } from "../data/treks";
import { useActiveIndex } from "../lib/store";
import { FoldedMap } from "./FoldedMap";
import { ContourModel } from "./ContourModel";

const RADIUS = 2.75;
const STEP = (Math.PI * 2) / TREKS.length;

function Disc() {
  const rings = useMemo(() => [1.2, 2.0, 2.75, 3.5, 4.1], []);
  return (
    <group position={[0, -0.12, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[4.4, 4.4, 0.22, 96]} />
        <meshStandardMaterial color="#0b1019" roughness={0.65} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[4.6, 4.7, 0.1, 96]} />
        <meshStandardMaterial color="#060910" roughness={0.9} />
      </mesh>
      {rings.map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.112, 0]}>
          <ringGeometry args={[r - 0.006, r + 0.006, 128]} />
          <meshBasicMaterial color="#1c2537" transparent opacity={0.9} />
        </mesh>
      ))}
      {/* tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 4.25, 0.112, Math.cos(a) * 4.25]} rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.008, i % 5 === 0 ? 0.16 : 0.07]} />
            <meshBasicMaterial color={i % 5 === 0 ? "#3a4b66" : "#1c2537"} />
          </mesh>
        );
      })}
    </group>
  );
}

function Card({ index, active }: { index: number; active: boolean }) {
  const trek = TREKS[index];
  const a = index * STEP;
  const folded = useRef<THREE.Group>(null);
  const open = useRef<THREE.Group>(null);
  const state = useRef({ open: active ? 1 : 0 });

  useEffect(() => {
    gsap.to(state.current, {
      open: active ? 1 : 0,
      duration: 0.9,
      delay: active ? 0.35 : 0,
      ease: active ? "back.out(1.4)" : "power2.in",
    });
  }, [active]);

  useFrame(() => {
    const o = state.current.open;
    if (open.current) {
      open.current.scale.set(0.6 + 0.4 * o, Math.max(0.001, o), 0.6 + 0.4 * o);
      open.current.visible = o > 0.002;
    }
    if (folded.current) {
      const f = 1 - o;
      folded.current.scale.set(Math.max(0.001, f), Math.max(0.001, f), Math.max(0.001, f));
      folded.current.visible = f > 0.002;
      folded.current.rotation.z = (1 - f) * 0.6;
    }
  });

  return (
    <group position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation={[0, a, 0]}>
      <group ref={folded} rotation={[0, -0.25, 0]}>
        <FoldedMap trek={trek} />
      </group>
      <group ref={open} position={[0, 0.12, 0]}>
        <ContourModel trek={trek} size={1.75} />
      </group>
    </group>
  );
}

function Wheel() {
  const active = useActiveIndex();
  const group = useRef<THREE.Group>(null);
  const rot = useRef({ y: -active * STEP });

  useEffect(() => {
    const target = -active * STEP;
    const cur = rot.current.y;
    const delta = ((((target - cur + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
    gsap.to(rot.current, { y: cur + delta, duration: 1.3, ease: "power3.inOut" });
  }, [active]);

  useFrame(() => {
    if (group.current) group.current.rotation.y = rot.current.y;
  });

  return (
    <group ref={group}>
      {TREKS.map((t, i) => (
        <Card key={t.id} index={i} active={i === active} />
      ))}
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.2, 0.6), []);
  useFrame(() => {
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (4.3 + pointer.y * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(target);
  });
  return null;
}

export function Turntable({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas camera={{ position: [0, 4.3, 10.4], fov: 28 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, 6, 5]} intensity={2.4} color="#fff4e4" />
        <directionalLight position={[5, 3, -4]} intensity={0.7} color="#6f8fc0" />
        <spotLight position={[0, 6, 4]} angle={0.5} penumbra={0.8} intensity={30} color="#ffffff" />
        <Disc />
        <Wheel />
        <Rig />
      </Canvas>
    </div>
  );
}
