import { useEffect, useId, useRef, useState } from "react";

const PARTNERS = [
  {
    name: "Musikawedu",
    href: "https://musikawedu.com",
    src: "/images/partner-musikawedu.png",
  },
];

const SDGS = [
  {
    n: 1,
    label: "No Poverty",
    color: "#E5243B",
    description: "End poverty in all its forms everywhere.",
  },
  {
    n: 12,
    label: "Responsible Consumption and Production",
    color: "#BF8B2E",
    description: "Ensure sustainable consumption and production patterns.",
  },
  {
    n: 2,
    label: "Zero Hunger",
    color: "#DDA63A",
    description: "End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.",
  },
  {
    n: 15,
    label: "Life on Land",
    color: "#56C02B",
    description: "Protect, restore and promote sustainable use of terrestrial ecosystems and halt biodiversity loss.",
  },
  {
    n: 9,
    label: "Industry, Innovation and Infrastructure",
    color: "#F36D25",
    description: "Build resilient infrastructure, promote inclusive and sustainable industrialisation, and foster innovation.",
  },
] as const;

type Sdg = (typeof SDGS)[number];

function SdgWheel({ size = 36 }: { size?: number }) {
  const colors = ["#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"];
  const r = size / 2;
  const inner = r * 0.32;
  const wedge = (i: number) => {
    const a0 = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / colors.length) * Math.PI * 2 - Math.PI / 2;
    const ox = (a: number, rad: number) => r + Math.cos(a) * rad;
    const oy = (a: number, rad: number) => r + Math.sin(a) * rad;
    return [
      `M ${ox(a0, inner)} ${oy(a0, inner)}`,
      `L ${ox(a0, r)} ${oy(a0, r)}`,
      `A ${r} ${r} 0 0 1 ${ox(a1, r)} ${oy(a1, r)}`,
      `L ${ox(a1, inner)} ${oy(a1, inner)}`,
      `A ${inner} ${inner} 0 0 0 ${ox(a0, inner)} ${oy(a0, inner)}`,
      "Z",
    ].join(" ");
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="inline-block shrink-0 align-middle">
      {colors.map((c, i) => (
        <path key={c} d={wedge(i)} fill={c} />
      ))}
    </svg>
  );
}

function SdgTile({ goal, open, onOpen, onClose }: { goal: Sdg; open: boolean; onOpen: () => void; onClose: () => void }) {
  const panelId = useId();
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) onClose();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Sustainable Development Goal ${goal.n}: ${goal.label}`}
        onClick={() => (open ? onClose() : onOpen())}
        className={`relative z-10 grid h-14 w-14 place-items-center text-[22px] font-bold text-white outline-none transition duration-200 ${
          open ? "z-30 scale-[1.35] shadow-[0_18px_40px_-18px_rgba(31,38,26,0.55)] ring-2 ring-white" : "hover:z-20 hover:scale-110"
        }`}
        style={{ backgroundColor: goal.color }}
      >
        {goal.n}
      </button>
      <div
        id={panelId}
        role="region"
        hidden={!open}
        className={`absolute left-1/2 top-[calc(100%+10px)] z-40 w-[220px] -translate-x-1/2 rounded-2xl border border-line bg-white p-4 text-left shadow-[0_20px_50px_-24px_rgba(31,38,26,0.45)] transition ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center text-[26px] font-bold text-white" style={{ backgroundColor: goal.color }} aria-hidden>
            {goal.n}
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-grey">Goal {goal.n}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug text-ink">{goal.label}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-grey">{goal.description}</p>
      </div>
    </li>
  );
}

export function Partners() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="border-t border-line bg-white" aria-label="Official partners and standards">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <div className="eyebrow">Official partners</div>
        <h2 className="mt-3 max-w-[640px] text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight">
          Mufudzi is an official product of Musikawedu.
        </h2>
        <div className="mt-10">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={p.name}
              className="flex h-28 max-w-[420px] items-center justify-center rounded-[20px] border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-green"
            >
              <img src={p.src} alt="" className="max-h-16 max-w-[220px] object-contain" />
            </a>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-16">
          <div className="eyebrow">Standards</div>
          <h2 className="mt-3 max-w-[720px] text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight">
            Ear tag built to ISO 11785:2026
          </h2>
          <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-grey">
            The Mufudzi ear tag is certified to{" "}
            <a
              href="https://www.iso.org/standard/91012.html"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink underline decoration-green underline-offset-4 hover:text-green-dark"
            >
              ISO 11785:2026
            </a>
            {" "}
            — Radio frequency identification of animals — Technical concept. The standard covers how a livestock transponder is activated and how stored information is transferred to a transceiver.
          </p>

          <a
            href="https://www.iso.org/standard/91012.html"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 transition hover:border-green"
          >
            <img src="/images/iso-logo-red.svg" alt="" className="h-12 w-auto" aria-hidden />
            <span className="text-left">
              <span className="block text-sm font-bold uppercase tracking-wider text-grey">International Standard</span>
              <span className="mt-0.5 block text-[17px] font-bold text-ink">ISO 11785:2026</span>
            </span>
          </a>

          <div className="mt-10 max-w-[560px] overflow-visible rounded-[20px] border border-line bg-white p-8 text-center shadow-[0_16px_40px_-28px_rgba(31,38,26,0.35)]">
            <div className="flex items-center justify-center gap-3">
              <p className="text-left text-[11px] font-semibold uppercase leading-tight tracking-[0.04em] text-[#4C9AD8]">
                Sustainable
                <br />
                Development
              </p>
              <p className="flex items-center gap-1.5 text-[28px] font-bold leading-none tracking-tight text-[#4C9AD8]">
                G
                <SdgWheel size={30} />
                ALS
              </p>
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-[#4a4a4a]">
              This standard contributes to the following{" "}
              <span className="font-semibold text-[#E5243B]">Sustainable Development Goals</span>
            </p>
            <p className="mt-2 text-xs text-grey">Hover or tap a goal to see its description.</p>
            <ul className="relative mt-7 flex flex-wrap items-start justify-center gap-3 pb-36">
              {SDGS.map((g) => (
                <SdgTile
                  key={g.n}
                  goal={g}
                  open={active === g.n}
                  onOpen={() => setActive(g.n)}
                  onClose={() => setActive((n) => (n === g.n ? null : n))}
                />
              ))}
            </ul>
            <p className="mt-2 text-xs text-grey">
              Source:{" "}
              <a href="https://www.iso.org/standard/91012.html" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                iso.org/standard/91012
              </a>
              {" · "}
              <a href="https://www.iso.org/sdg" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
                ISO and the SDGs
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
