import { useMedia } from "../lib/hooks";
import { Icon } from "../components/ui";
import { scrollTo } from "../lib/smooth-scroll";
import { ANIMALS, CONTACT } from "../data/content";

export function Hero() {
  const reduceMotion = useMedia("(prefers-reduced-motion: reduce)");

  return (
    <section id="top" className="relative">
      <div className="relative h-[92svh] min-h-[680px] overflow-hidden bg-[#e7e2d6]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/mufudzi.mp4"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white from-0% via-white/70 via-[38%] to-transparent to-[72%]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-center px-6 pb-16 pt-24">
          <div className="max-w-[640px]">
            <h1 className="text-[clamp(36px,5vw,60px)] font-bold leading-[1.02] tracking-tight text-ink">
              Mufudzi. 1.38 billion livestock. One digital shepherd.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-grey md:text-xl">
              From pasture to pixel — tracking Africa’s cattle, sheep, goats and horses, and the wildlife in its game parks, by 2045.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-grey">
              Compact GF-JRD-09 GPS locator for cattle, sheep, goats and horses — multi-mode positioning, smart fence
              alerts, solar charging.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {ANIMALS.map((a) => (
                <li key={a} className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink ring-1 ring-line">
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-green">
                <Icon.WhatsApp /> Inquire on WhatsApp
              </a>
              <a href={`tel:${CONTACT.phoneIntl}`} className="btn btn-green">
                <Icon.Phone /> Call
              </a>
              <a href="#tracker" onClick={(e) => (e.preventDefault(), scrollTo("#tracker"))} className="btn btn-ghost">
                See the tracker
              </a>
            </div>
            <p className="mt-5 text-xs text-grey">Typical response: under 30 minutes during business hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
