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

const field =
  "demo-field mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-green focus:ring-2 focus:ring-green/20";

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
        className="mt-12 max-w-[520px] space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          setResult(neededTrackers(animals, herd.perTracker));
        }}
      >
        <label className="block text-sm font-semibold text-ink">
          Herd type
          <select
            value={herdId}
            onChange={(e) => setHerdId(e.target.value as HerdId)}
            className={field}
          >
            {HERDS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label} (1 tracker : {h.perTracker} animals)
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-ink">
          Number of animals
          <input
            required
            inputMode="numeric"
            min={1}
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, ""))}
            className={field}
          />
        </label>

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
