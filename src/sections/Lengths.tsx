import { useMemo } from "react";
import { TREKS } from "../data/treks";
import { useAllRoutes } from "../lib/hooks";
import { fmtKm, fmtMetres } from "../lib/geo";
import { activeStore, useActiveIndex } from "../lib/store";
import { scrollTo } from "../lib/smooth-scroll";
import { Section, SectionHead, Arrow } from "../components/ui";

export function Lengths() {
  const treks = useMemo(() => TREKS, []);
  const routes = useAllRoutes(treks);
  const active = useActiveIndex();
  const maxDist = Math.max(1, ...Object.values(routes).map((r) => r.distanceM));

  return (
    <Section id="lengths">
      <SectionHead index="01" label="Lengths" title={<>From one day to twelve.</>}>
        Distances and climbs below are measured from our route trace draped over real terrain — the same model
        you walk in the flythrough. A trace is straighter than a trail, so expect the walked distance to run
        longer.
      </SectionHead>

      <ol className="mt-16 border-t hairline">
        {treks.map((t, i) => {
          const r = routes[t.id];
          const w = r ? (r.distanceM / maxDist) * 100 : 0;
          return (
            <li key={t.id} className="border-b hairline">
              <button
                onClick={() => {
                  activeStore.set(i);
                  scrollTo("#top");
                }}
                className="group grid w-full grid-cols-[auto_1fr] gap-x-6 gap-y-3 py-7 text-left md:grid-cols-[60px_1.4fr_1fr_1fr_1fr_1fr_40px] md:items-center md:gap-x-8"
              >
                <span className="eyebrow !text-red">{t.index}</span>
                <span>
                  <span className={`font-serif text-3xl leading-none ${active === i ? "text-paper" : "text-paper/85"}`}>{t.name}</span>
                  <span className="mt-1 block text-xs text-paper/50">
                    {t.route} · {t.country}
                  </span>
                </span>
                <Stat label="Duration" value={`${t.days} ${t.days === 1 ? "day" : "days"}`} />
                <Stat label="Distance" value={r ? fmtKm(r.distanceM) : "—"} />
                <Stat label="Ascent" value={r ? `+${fmtMetres(r.gainM)}` : "—"} />
                <Stat label="High point" value={fmtMetres(t.highPoint.ele)} sub={t.difficulty} />
                <span className="hidden text-paper/40 transition group-hover:translate-x-1 group-hover:text-paper md:block">
                  <Arrow />
                </span>
                <span className="col-span-2 md:col-span-7">
                  <span className="block h-px w-full bg-line">
                    <span
                      className="block h-px transition-[width] duration-700"
                      style={{ width: `${w}%`, background: t.accent }}
                    />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <span className="block">
      <span className="eyebrow block">{label}</span>
      <span className="num mt-1 block text-base text-paper/85">{value}</span>
      {sub && <span className="block text-[11px] text-paper/45">{sub}</span>}
    </span>
  );
}
