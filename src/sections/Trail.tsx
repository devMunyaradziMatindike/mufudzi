import { useEffect, useRef } from "react";
import { useActiveTrek, scroll } from "../lib/store";
import { useRoute } from "../lib/hooks";
import { fmtKm, fmtMetres } from "../lib/geo";
import { gsap, ScrollTrigger } from "../lib/smooth-scroll";
import { TrailFlythrough } from "../scenes/TrailFlythrough";

export function Trail() {
  const trek = useActiveTrek();
  const data = useRoute(trek);
  const section = useRef<HTMLElement>(null);
  const distEl = useRef<HTMLSpanElement>(null);
  const eleEl = useRef<HTMLSpanElement>(null);
  const pctEl = useRef<HTMLSpanElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const markerEl = useRef<SVGCircleElement>(null);
  const dayEl = useRef<HTMLSpanElement>(null);

  // scroll → progress
  useEffect(() => {
    if (!section.current) return;
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scroll.trail = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  // progress → HUD (no React renders)
  useEffect(() => {
    if (!data) return;
    const { route } = data;
    const n = route.profile.length;
    const tick = () => {
      const p = scroll.trail;
      const i = Math.min(n - 1, Math.round(p * (n - 1)));
      if (distEl.current) distEl.current.textContent = fmtKm(route.distanceM * p, 1);
      if (eleEl.current) eleEl.current.textContent = fmtMetres(route.profile[i]);
      if (pctEl.current) pctEl.current.textContent = `${Math.round(p * 100)}%`;
      if (barEl.current) barEl.current.style.transform = `scaleX(${p})`;
      if (dayEl.current) dayEl.current.textContent = `Day ${Math.min(trek.days, 1 + Math.floor(p * trek.days))}`;
      if (markerEl.current) {
        markerEl.current.setAttribute("cx", `${p * 100}`);
        const y = 100 - ((route.profile[i] - route.minEle) / Math.max(1, route.maxEle - route.minEle)) * 100;
        markerEl.current.setAttribute("cy", `${y}`);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [data, trek.days]);

  const profilePath = (() => {
    if (!data) return "";
    const { profile, minEle, maxEle } = data.route;
    const n = profile.length;
    const pts: string[] = [];
    for (let i = 0; i < n; i += Math.max(1, Math.floor(n / 120))) {
      const x = (i / (n - 1)) * 100;
      const y = 100 - ((profile[i] - minEle) / Math.max(1, maxEle - minEle)) * 100;
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return pts.join(" ");
  })();

  return (
    <section id="trail" ref={section} className="relative h-[560vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <TrailFlythrough trek={trek} className="absolute inset-0" />

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 pt-24 md:p-12 md:pt-28">
          <div className="flex items-start justify-between">
            <div>
              <div className="eyebrow mb-2 flex items-center gap-3">
                <span className="dot" /> Walking the route · {trek.region}
              </div>
              <div className="font-serif text-4xl leading-none md:text-6xl">{trek.name}</div>
              <div className="mt-2 text-sm text-paper/60">{trek.route}</div>
            </div>
            <div className="hidden text-right md:block">
              <div className="eyebrow">Terrain</div>
              <div className="mt-1 text-xs text-paper/70">
                Real elevation · 1.6× vertical · {data ? `${(data.hm.meta.widthM / 1000).toFixed(0)} km tile` : ""}
              </div>
            </div>
          </div>

          <div className="grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="eyebrow mb-2">Distance walked</div>
              <div className="num font-serif text-5xl leading-none md:text-7xl">
                <span ref={distEl}>0.0 km</span>
              </div>
              <div className="eyebrow mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                <span className="text-paper/40">Altitude</span>
                <span className="num !text-paper" ref={eleEl}>
                  —
                </span>
                <span className="text-paper/40">Total</span>
                <span className="num">{data ? `${fmtKm(data.route.distanceM)} · +${fmtMetres(data.route.gainM)}` : "—"}</span>
                <span className="text-paper/40">Stage</span>
                <span ref={dayEl}>Day 1</span>
              </div>
            </div>

            <div className="md:col-span-5 md:col-start-8">
              <div className="eyebrow mb-2 flex justify-between">
                <span>Elevation profile</span>
                <span className="num" ref={pctEl}>
                  0%
                </span>
              </div>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-20 w-full overflow-visible">
                <defs>
                  <linearGradient id="prof" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={trek.accent} stopOpacity="0.5" />
                    <stop offset="1" stopColor={trek.accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {profilePath && (
                  <>
                    <polygon points={`0,100 ${profilePath} 100,100`} fill="url(#prof)" />
                    <polyline points={profilePath} fill="none" stroke="#f3ead8" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    <circle ref={markerEl} cx="0" cy="100" r="1.4" fill="#e23b2e" vectorEffect="non-scaling-stroke" />
                  </>
                )}
              </svg>
              <div className="mt-2 h-px w-full bg-line">
                <div ref={barEl} className="h-px w-full origin-left bg-paper" style={{ transform: "scaleX(0)" }} />
              </div>
              <div className="eyebrow mt-2 flex justify-between">
                <span>{data ? fmtMetres(data.route.minEle) : ""}</span>
                <span>{data ? fmtMetres(data.route.maxEle) : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
