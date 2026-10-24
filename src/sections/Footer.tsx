import { useState } from "react";
import { TREKS } from "../data/treks";
import { useActiveTrek } from "../lib/store";
import { Logo } from "../components/ui";

export function Footer() {
  const active = useActiveTrek();
  const [sent, setSent] = useState(false);

  return (
    <footer id="book" className="border-t hairline">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-5">
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="dot" /> Book a trek
          </div>
          <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
            Pick a card.
            <br />
            We'll unfold the rest.
          </h2>
          <p className="mt-6 max-w-[380px] text-sm leading-relaxed text-paper/65">
            Tell us which trek and roughly when. A guide — not a sales team — replies within two days with dates,
            a kit list and honest advice about fitness.
          </p>
        </div>

        <form
          className="md:col-span-6 md:col-start-7"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-px border hairline bg-line sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" />
            <label className="block bg-ink p-5">
              <span className="eyebrow">Trek</span>
              <select
                name="trek"
                defaultValue={active.id}
                className="mt-2 w-full bg-transparent font-serif text-xl text-paper outline-none"
              >
                {TREKS.map((t) => (
                  <option key={t.id} value={t.id} className="bg-ink">
                    {t.index} · {t.name} — ${t.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
            <Field label="When, roughly" name="when" placeholder="e.g. October 2027" />
            <label className="block bg-ink p-5 sm:col-span-2">
              <span className="eyebrow">Anything we should know</span>
              <textarea
                name="notes"
                rows={3}
                placeholder="Experience, group size, questions"
                className="mt-2 w-full resize-none bg-transparent font-serif text-xl text-paper placeholder:text-paper/25 outline-none"
              />
            </label>
          </div>
          <div className="mt-5 flex items-center justify-between gap-6">
            <span className="eyebrow">
              {sent ? "Thanks — a guide will be in touch." : "No deposit until dates are fixed."}
            </span>
            <button type="submit" className="btn btn-paper">
              <span className="dot" /> Send enquiry
            </button>
          </div>
        </form>
      </div>

      <div className="border-t hairline">
        <div className="eyebrow mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <Logo />
          <span>
            Terrain: AWS Terrain Tiles (Mapzen Terrarium) · Coastlines: Natural Earth · Routes hand-traced
          </span>
          <span>© {new Date().getFullYear()} Fold Line</span>
        </div>
      </div>
    </footer>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="block bg-ink p-5">
      <span className="eyebrow">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent font-serif text-xl text-paper placeholder:text-paper/25 outline-none"
      />
    </label>
  );
}
