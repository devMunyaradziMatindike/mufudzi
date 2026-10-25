import { useEffect, useState } from "react";
import { PHOTOS } from "../data/content";
import { Section, SectionHead } from "../components/ui";

export function Solutions() {
  const [open, setOpen] = useState<(typeof PHOTOS)[number] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <Section id="tracker">
      <SectionHead title="See the tracker" align="center">
        Compact ear-tag locator — tap any photo to enlarge.
      </SectionHead>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PHOTOS.map((p) => (
          <figure key={p.src} className="card overflow-hidden">
            <button type="button" className="block w-full text-left" onClick={() => setOpen(p)} aria-label={`Enlarge ${p.title}`}>
              <img src={p.src} alt={p.alt} className="h-44 w-full bg-white object-contain" />
            </button>
            <figcaption className="p-4">
              <h3 className="text-base font-bold">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-grey">{p.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-4" onClick={() => setOpen(null)} role="presentation">
          <figure className="max-h-[90svh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={open.src} alt={open.alt} className="max-h-[80svh] w-full rounded-2xl bg-white object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white">{open.title}</figcaption>
          </figure>
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold" onClick={() => setOpen(null)}>
            Close
          </button>
        </div>
      )}
    </Section>
  );
}
