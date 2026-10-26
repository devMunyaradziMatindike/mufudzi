type ArtKind = "collars" | "fence" | "datanimal" | "scale" | "lux";

/** Small vector illustrations for the product cards (no third-party imagery). */
export function ProductArt({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "collars":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          {[
            { x: 40, y: 50, label: "ECO", panel: true },
            { x: 130, y: 40, label: "EVO", panel: false },
            { x: 220, y: 55, label: "SAT", panel: true },
          ].map((d) => (
            <g key={d.label} transform={`translate(${d.x} ${d.y})`}>
              <rect x="0" y="0" width="64" height="76" rx="14" fill="#82b718" />
              <rect x="0" y="0" width="64" height="76" rx="14" fill="url(#shade)" />
              {d.panel ? (
                <rect x="12" y="12" width="40" height="40" rx="5" fill="#141a26" />
              ) : (
                <circle cx="32" cy="32" r="18" fill="#1f2a1a" />
              )}
              <text x="32" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
                {d.label}
              </text>
              <rect x="24" y="-10" width="16" height="12" rx="3" fill="#6a9a12" />
            </g>
          ))}
          <defs>
            <linearGradient id="shade" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#000" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "fence":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          <rect width="320" height="180" fill="#dfe9d2" />
          <path d="M0 120 Q80 90 160 115 T320 100 V180 H0z" fill="#c9dbb4" />
          <path d="M0 40 Q90 10 180 50 T320 30" stroke="#b9cfa0" strokeWidth="14" fill="none" opacity="0.7" />
          <polygon points="70,60 240,45 260,135 90,150" fill="rgba(255,105,0,0.12)" stroke="#ff6900" strokeWidth="2.5" strokeDasharray="7 4" />
          {[
            [70, 60],
            [240, 45],
            [260, 135],
            [90, 150],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#ff6900" stroke="#fff" strokeWidth="2" />
          ))}
          {[
            [120, 90],
            [150, 110],
            [180, 80],
            [205, 105],
            [140, 70],
            [230, 120],
            [160, 128],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="4.5" fill="#82b718" stroke="#fff" strokeWidth="1.5" />
          ))}
          <circle cx="245" cy="68" r="4.5" fill="#f5a623" stroke="#fff" strokeWidth="1.5" />
          <circle cx="245" cy="68" r="10" fill="none" stroke="#f5a623" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );
    case "datanimal":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          <rect width="320" height="180" fill="#f4f6f0" />
          <rect x="24" y="22" width="272" height="136" rx="12" fill="#fff" stroke="#e4e8de" />
          <rect x="40" y="38" width="90" height="10" rx="5" fill="#e4e8de" />
          {[
            [40, 70, 60, "#82b718"],
            [40, 92, 110, "#82b718"],
            [40, 114, 80, "#b9cfa0"],
            [40, 136, 140, "#82b718"],
          ].map(([x, y, w, c]) => (
            <g key={`${y}`}>
              <rect x={x as number} y={y as number} width="170" height="8" rx="4" fill="#eef0ea" />
              <rect x={x as number} y={y as number} width={w as number} height="8" rx="4" fill={c as string} />
            </g>
          ))}
          <polyline points="230,120 245,100 258,108 272,78 286,86" fill="none" stroke="#82b718" strokeWidth="3" strokeLinecap="round" />
          <circle cx="286" cy="86" r="4" fill="#82b718" />
          <rect x="226" y="40" width="64" height="30" rx="8" fill="#eef6df" />
          <text x="258" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1f261a">
            184
          </text>
        </svg>
      );
    case "scale":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          <rect width="320" height="180" fill="#f4f6f0" />
          <rect x="40" y="128" width="240" height="16" rx="4" fill="#565656" />
          <rect x="48" y="118" width="224" height="12" rx="3" fill="#8f8f8f" />
          <rect x="120" y="60" width="86" height="42" rx="6" fill="#1f261a" />
          <text x="163" y="88" textAnchor="middle" fontSize="20" fontWeight="700" fill="#82b718" fontFamily="Teachers">
            512 kg
          </text>
          <path d="M60 118 V80 h12 V118" fill="#565656" />
          <path d="M248 118 V80 h12 V118" fill="#565656" />
          <path d="M60 80 H272" stroke="#565656" strokeWidth="6" />
          <rect x="88" y="92" width="36" height="14" rx="4" fill="#82b718" />
        </svg>
      );
    case "lux":
      return (
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          <rect width="320" height="180" fill="#0a1222" />
          <circle cx="60" cy="40" r="14" fill="#f3f1e6" opacity="0.8" />
          <path d="M160 170 L105 60 L215 60 Z" fill="url(#beam)" />
          <rect x="156" y="60" width="8" height="90" fill="#565656" />
          <circle cx="160" cy="58" r="12" fill="#fff1b8" />
          <circle cx="160" cy="58" r="22" fill="#fff1b8" opacity="0.25" />
          <ellipse cx="160" cy="158" rx="80" ry="12" fill="#ffe9a8" opacity="0.15" />
          <path d="M250 140 l22 -6 l14 4 l-4 10 l-28 2z" fill="#2a2a2e" />
          <circle cx="282" cy="136" r="1.6" fill="#ffd166" />
          <circle cx="288" cy="137" r="1.6" fill="#ffd166" />
          <defs>
            <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff1b8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff1b8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
}
