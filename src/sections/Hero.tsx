import { useEffect } from "react";
import { TREKS } from "../data/treks";
import { useActiveIndex, useActiveTrek, stepActive, activeStore } from "../lib/store";
import { useRoute } from "../lib/hooks";
import { fmtKm, fmtMetres } from "../lib/geo";
import { scrollTo } from "../lib/smooth-scroll";
import { Globe } from "../scenes/Globe";
import { Turntable } from "../scenes/Turntable";
import { CONTOUR_STEPS } from "../scenes/ContourModel";
import { Arrow } from "../components/ui";

export function Hero() {
  const trek = useActiveTrek();
  const index = useActiveIndex();
  const data = useRoute(trek);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") stepActive(1);
      if (e.key === "ArrowLeft") stepActive(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const distance = data ? fmtKm(data.route.distanceM) : "— km";

  return (
    <section id="top" className="relative px-3 pt-20 pb-3 md:px-4 md:pt-24 md:pb-4">
      <div className="frame grain relative overflow-hidden">
        <div className="relative h-[calc(100svh-6.5rem)] min-h-[720px] xl:min-h-[780px]">
          {/* 3D layers */}
          <Turntable className="absolute inset-x-0 bottom-[-3%] top-[30%] md:top-[26%]" />
          <Globe className="absolute left-1/2 top-[4%] aspect-square h-[30%] -translate-x-1/2 md:top-[5%] md:h-[36%]" />

          {/* copy */}
          <div className="absolute left-6 top-[12%] max-w-[360px] md:left-12 md:top-[15%]">
            <h1 className="font-serif text-[clamp(40px,5vw,76px)] leading-[0.92] tracking-tight">
              Every trek
              <br />
              folds into
              <br />
              a <span className="text-red">pocket.</span>
            </h1>
            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-paper/65">
              Guided treks and expeditions since 2011. Five to start with, from one day on a volcano to twelve
              under Everest.
            </p>
            <div className="eyebrow mt-6 hidden items-center gap-3 md:flex">
              <span className="dot" /> Scroll down for lengths, guides and dates
            </div>
          </div>

          {/* pin CTA */}
          <button
            onClick={() => scrollTo("#trail")}
            className="group absolute left-1/2 top-[52%] z-10 flex -translate-x-1/2 items-center gap-4 text-left"
          >
            <span className="pin-pulse relative grid h-7 w-7 place-items-center rounded-full bg-red shadow-[0_0_30px_rgba(226,59,46,0.6)]">
              <span className="h-2 w-2 rounded-full bg-paper/90" />
            </span>
            <span>
              <span className="eyebrow block !text-paper">Explore the trail</span>
              <span className="block text-xs text-paper/60 group-hover:text-paper">
                Go in at the <span className="text-red">pin</span>
              </span>
            </span>
          </button>

          {/* arrows */}
          <ArrowButton side="left" onClick={() => stepActive(-1)} />
          <ArrowButton side="right" onClick={() => stepActive(1)} />

          {/* footer strip under the model */}
          <div className="eyebrow absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap md:gap-6">
            <span>
              {trek.days} {trek.days === 1 ? "day" : "days"}
            </span>
            <span>·</span>
            <span>{distance}</span>
            <span>·</span>
            <span>Max {fmtMetres(trek.highPoint.ele)}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">{trek.country}</span>
          </div>

          {/* stats panel, desktop */}
          <aside className="absolute right-12 top-[38%] hidden w-[290px] xl:block">
            <Stats trek={trek} index={index} distance={distance} gain={data?.route.gainM} range={data ? data.hm.meta.maxEle - data.hm.meta.minEle : 0} />
          </aside>

          <div className="eyebrow num absolute bottom-5 right-6 md:right-12">
            {trek.index} / {String(TREKS.length).padStart(2, "0")}
          </div>
        </div>

        {/* stats panel, smaller screens */}
        <div className="border-t hairline p-6 xl:hidden">
          <Stats trek={trek} index={index} distance={distance} gain={data?.route.gainM} range={data ? data.hm.meta.maxEle - data.hm.meta.minEle : 0} compact />
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous trek" : "Next trek"}
      className={`absolute top-[72%] grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/60 text-paper backdrop-blur transition hover:bg-paper hover:text-ink ${
        side === "left" ? "left-[8%] md:left-[22%]" : "right-[8%] md:right-[22%]"
      }`}
    >
      <Arrow dir={side} />
    </button>
  );
}

function Stats({
  trek,
  index,
  distance,
  gain,
  range,
  compact = false,
}: {
  trek: (typeof TREKS)[number];
  index: number;
  distance: string;
  gain?: number;
  range: number;
  compact?: boolean;
}) {
  const maxEle = Math.max(...TREKS.map((t) => t.highPoint.ele));
  const layerM = range ? Math.round(range / CONTOUR_STEPS / 10) * 10 : 0;

  const bars = (
    <div className="flex items-end gap-2" aria-label="Height comparison">
      {TREKS.map((t, i) => (
        <button
          key={t.id}
          onClick={() => activeStore.set(i)}
          title={`${t.name} · ${fmtMetres(t.highPoint.ele)}`}
          className="group flex w-7 flex-col items-center gap-1"
        >
          <span
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${12 + (t.highPoint.ele / maxEle) * 52}px`,
              background: i === index ? "#f3ead8" : t.accent + "66",
            }}
          />
          <span className={`eyebrow !text-[8px] ${i === index ? "!text-paper" : ""}`}>{t.index}</span>
        </button>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="eyebrow mb-2">
            {trek.index} · {trek.days} {trek.days === 1 ? "day" : "days"} · {distance} · {trek.country}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="font-serif text-3xl leading-none">{trek.name}</h2>
            <span className="text-sm text-paper/60">{trek.route}</span>
          </div>
          <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-paper/70">{trek.blurb}</p>
        </div>
        <div className="flex items-end gap-8">
          <div>
            <div className="num font-serif text-4xl leading-none">{fmtMetres(trek.highPoint.ele)}</div>
            <div className="eyebrow mt-1">{trek.highPoint.name}</div>
          </div>
          {bars}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 inline-flex items-center gap-2 border border-line px-2 py-1">
        <span className="dot" />
        <span className="eyebrow !text-paper">Expedition</span>
      </div>
      <div className="eyebrow mb-3">
        {trek.days} {trek.days === 1 ? "day" : "days"} · {distance} · {trek.country}
      </div>
      <h2 className="font-serif text-4xl leading-none">{trek.name}</h2>
      <div className="mt-1 text-sm text-paper/60">{trek.route}</div>
      <div className="num mt-4 font-serif text-[56px] leading-none tracking-tight">{fmtMetres(trek.highPoint.ele)}</div>
      <dl className="eyebrow mt-3 grid grid-cols-[52px_1fr] gap-x-4 gap-y-1">
        <dt className="text-paper/40">{trek.highPoint.name.split(" ")[0]}</dt>
        <dd className="!text-paper">High point of the trek</dd>
        <dt className="text-paper/40">Gain</dt>
        <dd className="num">{gain !== undefined ? `+${fmtMetres(gain)} measured` : "—"}</dd>
        <dt className="text-paper/40">Cards</dt>
        <dd>{layerM ? `${CONTOUR_STEPS} layers, ${layerM} m apart` : "—"}</dd>
      </dl>
      <p className="mt-4 text-sm leading-relaxed text-paper/70">{trek.blurb}</p>
      <div className="mt-5">{bars}</div>
    </>
  );
}
