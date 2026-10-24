import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { Trek } from "../data/treks";
import { useRoute } from "../lib/hooks";
import { SCENE_SIZE } from "../lib/route";
import { terrainVertex, contourFragment } from "./shaders";

const FRAME = "#2b5a9e";
const FRAME_DARK = "#1d3f73";
/** Number of stacked paper layers in the model. */
export const CONTOUR_STEPS = 22;

/**
 * The "paper model" that sits in the open map tray: the trek's real terrain,
 * quantised into stacked layers like a laser-cut relief, with the route
 * drawn on top and a red pin at the high point.
 */
export function ContourModel({ trek, size = 1.6 }: { trek: Trek; size?: number }) {
  const data = useRoute(trek);
  const s = size / SCENE_SIZE;

  const uniforms = useMemo(() => {
    if (!data) return null;
    const { hm, route } = data;
    const heightScale = (hm.meta.maxEle - hm.meta.minEle) * route.scale * route.exaggeration;
    return {
      uHeight: { value: hm.texture },
      uHeightScale: { value: heightScale },
      uSteps: { value: CONTOUR_STEPS },
      uTexel: { value: new THREE.Vector2(1 / hm.meta.width, 1 / hm.meta.height) },
      uSize: { value: new THREE.Vector2(SCENE_SIZE, (SCENE_SIZE * hm.meta.heightM) / hm.meta.widthM) },
      uLight: { value: new THREE.Vector3(-0.6, 1, 0.8) },
      uLow: { value: new THREE.Color("#c9c4b6") },
      uHigh: { value: new THREE.Color("#ffffff") },
    };
  }, [data]);

  const routePoints = useMemo(() => (data ? data.route.curve.getPoints(300) : []), [data]);
  const highPoint = useMemo(() => {
    if (!data) return null;
    const { route } = data;
    let best = 0;
    for (let i = 1; i < route.profile.length; i++) if (route.profile[i] > route.profile[best]) best = i;
    return route.curve.getPointAt(best / (route.profile.length - 1));
  }, [data]);

  if (!data || !uniforms) return null;
  const aspect = data.hm.meta.heightM / data.hm.meta.widthM;
  const depth = size * aspect;

  return (
    <group>
      {/* tray */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[size + 0.18, 0.1, depth + 0.18]} />
        <meshStandardMaterial color={FRAME} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.11, 0]}>
        <boxGeometry args={[size + 0.26, 0.04, depth + 0.26]} />
        <meshStandardMaterial color={FRAME_DARK} roughness={0.7} />
      </mesh>
      {/* base layer so the model never looks hollow at the edge */}
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[size, 0.002, depth]} />
        <meshStandardMaterial color="#d8d3c6" />
      </mesh>

      <group scale={[s, s, s]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[SCENE_SIZE, SCENE_SIZE * aspect, 160, Math.round(160 * aspect)]} />
          <shaderMaterial vertexShader={terrainVertex} fragmentShader={contourFragment} uniforms={uniforms} />
        </mesh>
        <Line points={routePoints} color={trek.accent} lineWidth={2} position={[0, 0.06, 0]} />
        {highPoint && (
          <group position={[highPoint.x, highPoint.y, highPoint.z]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
              <meshStandardMaterial color="#f3ead8" />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color="#e23b2e" emissive="#e23b2e" emissiveIntensity={0.6} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}
