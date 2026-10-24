/**
 * Terrain shaders. Both displace a PlaneGeometry (rotated to the XZ plane)
 * by a normalised height texture; normals are reconstructed per-fragment
 * from screen-space derivatives so the stepped model gets crisp flat faces.
 */

export const terrainVertex = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uHeightScale;
  uniform float uSteps;     // 0 = continuous, >0 = quantised layers
  uniform vec2 uTexel;      // 1 / heightmap size
  uniform vec2 uSize;       // plane size in local units (x, y)
  varying vec3 vWorld;
  varying vec3 vNormal;     // smooth world-space normal from the heightmap
  varying float vH;         // normalised 0..1
  varying vec2 vUv;

  float H(vec2 st) { return texture2D(uHeight, vec2(st.x, 1.0 - st.y)).r; }

  void main() {
    vUv = uv;
    float h = H(uv);
    if (uSteps > 0.0) h = floor(h * uSteps + 0.001) / uSteps;
    vH = h;

    // central differences for a smooth normal (world: x east, y up, z south)
    float hL = H(uv - vec2(uTexel.x, 0.0));
    float hR = H(uv + vec2(uTexel.x, 0.0));
    float hD = H(uv - vec2(0.0, uTexel.y));
    float hU = H(uv + vec2(0.0, uTexel.y));
    float dx = 2.0 * uTexel.x * uSize.x;
    float dz = 2.0 * uTexel.y * uSize.y;
    vNormal = normalize(vec3(-(hR - hL) * uHeightScale / dx, 1.0, (hU - hD) * uHeightScale / dz));

    vec3 p = position;
    p.z = h * uHeightScale;  // local z = world up after the -90° x rotation
    vec4 w = modelMatrix * vec4(p, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

/** Stacked-paper contour model: light layers, soft lambert, darker walls. */
export const contourFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  varying vec3 vWorld;
  varying float vH;

  void main() {
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    float lambert = clamp(dot(n, normalize(uLight)), 0.0, 1.0);
    float up = clamp(n.y, 0.0, 1.0);
    vec3 base = mix(uLow, uHigh, pow(vH, 0.8));
    // walls are the cut edges of the paper: a touch warmer and darker
    vec3 wall = base * 0.62;
    vec3 col = mix(wall, base, smoothstep(0.35, 0.9, up));
    col *= 0.55 + 0.55 * lambert;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Real-terrain flythrough: hypsometric tint, slope shade, contour lines, fog. */
export const terrainFragment = /* glsl */ `
  uniform vec3 uLight;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uMinEle;
  uniform float uMaxEle;
  uniform float uSnow;      // metres
  uniform float uContour;   // metres between lines
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vH;
  varying vec2 vUv;

  void main() {
    vec3 n = normalize(vNormal);
    float lambert = clamp(dot(n, normalize(uLight)), 0.0, 1.0);
    float slope = 1.0 - clamp(n.y, 0.0, 1.0);
    float ele = mix(uMinEle, uMaxEle, vH);

    vec3 valley = vec3(0.16, 0.21, 0.17);
    vec3 moor   = vec3(0.38, 0.34, 0.26);
    vec3 rock   = vec3(0.34, 0.32, 0.33);
    vec3 snow   = vec3(0.88, 0.90, 0.92);

    float t = clamp((ele - uMinEle) / max(1.0, uMaxEle - uMinEle), 0.0, 1.0);
    vec3 col = mix(valley, moor, smoothstep(0.0, 0.45, t));
    col = mix(col, rock, smoothstep(0.4, 0.8, t));
    float snowLine = smoothstep(uSnow - 250.0, uSnow + 250.0, ele) * (1.0 - slope * 0.9);
    col = mix(col, snow, snowLine);
    col = mix(col, rock * 0.8, slope * 0.5 * (1.0 - snowLine));

    // contour lines every uContour metres
    float c = ele / uContour;
    float f = abs(fract(c) - 0.5);
    float w = fwidth(c) * 1.2;
    float line = 1.0 - smoothstep(0.5 - w * 2.0, 0.5 - w, f);
    col = mix(col, col * 0.7, line * 0.6);

    col *= 0.45 + 0.7 * lambert;

    // dark grid-paper edge fade
    float d = distance(vUv, vec2(0.5));
    col = mix(col, uFog, smoothstep(0.42, 0.5, d));

    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fog = smoothstep(uFogNear, uFogFar, depth);
    col = mix(col, uFog, fog);
    gl_FragColor = vec4(col, 1.0);
  }
`;
