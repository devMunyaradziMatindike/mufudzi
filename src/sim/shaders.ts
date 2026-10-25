/** Displaces a PlaneGeometry (rotated to XZ) by a normalised height texture. */
export const terrainVertex = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uHeightScale;
  uniform vec2 uTexel;
  uniform vec2 uSize;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  varying vec2 vUv;

  float H(vec2 st) { return texture2D(uHeight, vec2(st.x, 1.0 - st.y)).r; }

  void main() {
    vUv = uv;
    float h = H(uv);
    vH = h;
    float hL = H(uv - vec2(uTexel.x, 0.0));
    float hR = H(uv + vec2(uTexel.x, 0.0));
    float hD = H(uv - vec2(0.0, uTexel.y));
    float hU = H(uv + vec2(0.0, uTexel.y));
    float dx = 2.0 * uTexel.x * uSize.x;
    float dz = 2.0 * uTexel.y * uSize.y;
    vNormal = normalize(vec3(-(hR - hL) * uHeightScale / dx, 1.0, (hU - hD) * uHeightScale / dz));
    vec3 p = position;
    p.z = h * uHeightScale;
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

/** Pasture: grass / dry grass / scrub by noise and height, slope rock, day → night tint, fog. */
export const pastureFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform float uNight;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec3 n = normalize(vNormal);
    float lambert = clamp(dot(n, normalize(uLight)), 0.0, 1.0);
    float slope = 1.0 - clamp(n.y, 0.0, 1.0);
    float nz = noise(vUv * 28.0) * 0.6 + noise(vUv * 140.0) * 0.4;

    vec3 grass = vec3(0.43, 0.60, 0.22);
    vec3 dry   = vec3(0.70, 0.64, 0.36);
    vec3 scrub = vec3(0.33, 0.40, 0.20);
    vec3 rock  = vec3(0.55, 0.52, 0.47);

    vec3 col = mix(grass, dry, smoothstep(0.35, 0.8, nz));
    col = mix(col, scrub, smoothstep(0.55, 0.95, vH) * 0.7);
    col = mix(col, rock, smoothstep(0.25, 0.7, slope));
    col *= 0.6 + 0.55 * lambert;

    vec3 nightCol = col * vec3(0.10, 0.14, 0.26) + vec3(0.0, 0.01, 0.03);
    col = mix(col, nightCol, uNight);

    float edge = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    col = mix(col, uFog, smoothstep(0.45, 0.5, edge));
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    col = mix(col, uFog, smoothstep(uFogNear, uFogFar, depth));
    gl_FragColor = vec4(col, 1.0);
  }
`;
