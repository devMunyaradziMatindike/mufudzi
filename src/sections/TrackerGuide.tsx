import { useState } from "react";
import { Section, SectionHead } from "../components/ui";
import { scrollTo } from "../lib/smooth-scroll";

const HERDS = [
  { id: "cattle", label: "Cattle", perTracker: 10 },
  { id: "small-cattle", label: "Small cattle herd", perTracker: 5 },
  { id: "mixed-cattle", label: "Mixed growth cattle", perTracker: 7 },
  { id: "sheep", label: "Sheep", perTracker: 5 },
  { id: "goats", label: "Goats", perTracker: 5 },
] as const;

type HerdId = (typeof HERDS)[number]["id"];

function neededTrackers(animals: number, perTracker: number) {
  if (!Number.isFinite(animals) || animals <= 0) return 0;
  return Math.max(1, Math.ceil(animals / perTracker));
}

export function TrackerGuide() {
  const [herdId, setHerdId] = useState<HerdId>("cattle");
  const [raw, setRaw] = useState("50");
  const [result, setResult] = useState<number | null>(null);

  const herd = HERDS.find((h) => h.id === herdId) ?? HERDS[0];
  const animals = Math.floor(Number(raw));
  const ready = Number.isFinite(animals) && animals > 0;
  const preview = ready ? neededTrackers(animals, herd.perTracker) : 0;

  const setAnimals = (next: number) => setRaw(String(Math.max(1, next)));

  const applyToPricing = (trackers: number) => {
    window.dispatchEvent(new CustomEvent("mufudzi:set-trackers", { detail: trackers }));
    setResult(null);
    scrollTo("#pricing", -72);
  };

  return (
    <Section id="tracker-guide" tone="surface">
      <SectionHead eyebrow="Herd guide" title="Don’t know how many trackers you need?">
        Pick your herd type and enter how many animals you keep. Ratios are cattle 1:10, small cattle herds 1:5, mixed growth cattle 1:7, and sheep or goats 1:5.
      </SectionHead>

      <form
        className="mt-12 max-w-[640px] space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          setResult(preview);
        }}
      >
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wider text-grey">Herd type</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {HERDS.map((h) => {
              const selected = h.id === herdId;
              return (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setHerdId(h.id)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    selected
                      ? "border-green bg-green-soft shadow-[0_8px_24px_-16px_rgba(130,183,24,0.9)]"
                      : "border-line bg-white hover:border-green"
                  }`}
                >
                  <span className="block text-[15px] font-bold text-ink">{h.label}</span>
                  <span className={`mt-1 block text-sm ${selected ? "text-green-dark" : "text-grey"}`}>
                    1 tracker : {h.perTracker} animals
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-bold uppercase tracking-wider text-grey">Number of animals</span>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-3 focus-within:border-green focus-within:ring-2 focus-within:ring-green/20">
            <button
              type="button"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-2xl leading-none transition hover:border-green hover:text-green-dark"
              aria-label="Fewer animals"
              onClick={() => setAnimals((Number.isFinite(animals) ? animals : 1) - 1)}
            >
              −
            </button>
            <input
              required
              inputMode="numeric"
              min={1}
              value={raw}
              aria-label="Number of animals"
              onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, ""))}
              className="num w-full bg-transparent text-center text-5xl font-bold tracking-tight text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-2xl leading-none transition hover:border-green hover:text-green-dark"
              aria-label="More animals"
              onClick={() => setAnimals((Number.isFinite(animals) && animals > 0 ? animals : 0) + 1)}
            >
              +
            </button>
          </div>
          <p className="mt-2 text-sm text-grey">We’ll round up to whole trackers.</p>
        </label>

        {ready && (
          <p className="text-[17px] leading-relaxed text-ink">
            About{" "}
            <span className="font-bold text-green-dark">
              {preview} {preview === 1 ? "tracker" : "trackers"}
            </span>{" "}
            for {animals.toLocaleString("en-US")} {herd.label.toLowerCase()}.
          </p>
        )}

        <button type="submit" className="btn btn-green" disabled={!ready}>
          Calculate trackers
        </button>
      </form>

      {result != null && (
        <div data-lenis-prevent className="fixed inset-0 z-[60] overflow-auto bg-ink/40 px-4 py-10" onClick={() => setResult(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tracker-guide-title"
            className="card mx-auto w-full max-w-[420px] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="tracker-guide-title" className="text-2xl font-bold tracking-tight text-ink">
              Tracker recommendation
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              For {animals.toLocaleString("en-US")} {herd.label.toLowerCase()}, you need{" "}
              <span className="font-bold text-ink">
                {result} {result === 1 ? "tracker" : "trackers"}
              </span>
              .
            </p>
            <p className="mt-2 text-sm text-grey">
              Based on 1 tracker for every {herd.perTracker} animals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="btn btn-green" onClick={() => applyToPricing(result)}>
                Use on Pricing
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setResult(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
