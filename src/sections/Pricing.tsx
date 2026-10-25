import { useState } from "react";
import { PRICING } from "../data/content";
import { Section, SectionHead } from "../components/ui";

const money = (n: number) => n.toLocaleString("en-US");

export function Pricing() {
  const [raw, setRaw] = useState("10");
  const parsed = Math.floor(Number(raw));
  const count = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const hardware = count * PRICING.tracker;
  const monthly = count * PRICING.license;

  const setCount = (next: number) => setRaw(String(Math.max(1, next)));

  return (
    <Section id="pricing">
      <SectionHead eyebrow="Pricing" title="USD 140 for the tracker. USD 8 a month after four months.">
        The first {PRICING.freeMonths} months of the license are included with the tracker. The USD {PRICING.license} license starts after that.
      </SectionHead>

      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <article className="card p-7">
            <div className="text-sm font-bold uppercase tracking-wider text-grey">Tracker</div>
            <div className="num mt-3 text-4xl font-bold tracking-tight">USD {PRICING.tracker}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-grey">
              One GF-JRD-09 GPS locator. Includes the first {PRICING.freeMonths} months of the license.
            </p>
          </article>
          <article className="card p-7">
            <div className="text-sm font-bold uppercase tracking-wider text-grey">License</div>
            <div className="num mt-3 text-4xl font-bold tracking-tight">
              USD {PRICING.license}
              <span className="text-lg font-semibold text-grey"> / month</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-grey">
              After {PRICING.freeMonths} months, USD {PRICING.license} per tracker each month.
            </p>
          </article>
        </div>

        <div className="card flex flex-col justify-between p-7 md:p-10">
          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-grey">Number of trackers</span>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full border border-line text-2xl leading-none transition hover:border-green hover:text-green-dark"
                aria-label="Fewer trackers"
                onClick={() => setCount(count - 1)}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={raw}
                aria-label="Number of trackers"
                onChange={(e) => setRaw(e.target.value.replace(/[^\d]/g, ""))}
                className="num w-full bg-transparent text-center text-5xl font-bold tracking-tight text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                className="grid h-12 w-12 place-items-center rounded-full border border-line text-2xl leading-none transition hover:border-green hover:text-green-dark"
                aria-label="More trackers"
                onClick={() => setCount(count + 1)}
              >
                +
              </button>
            </div>
          </label>

          <div className="mt-10 border-t border-line pt-8">
            <div className="text-sm font-bold uppercase tracking-wider text-grey">Total</div>
            <div className="num mt-2 text-[clamp(48px,6vw,72px)] font-bold leading-none tracking-tight text-green-dark">
              USD {money(hardware)}
            </div>
            <p className="mt-4 text-[15px] text-grey">
              {count} {count === 1 ? "tracker" : "trackers"} × USD {PRICING.tracker}. The first {PRICING.freeMonths} months are included.
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">
              Then USD {money(monthly)} / month
              <span className="font-normal text-grey"> after {PRICING.freeMonths} months.</span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
