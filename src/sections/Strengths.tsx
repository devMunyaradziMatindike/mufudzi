import { STATS, VISION } from "../data/content";
import { Section, SectionHead, Icon } from "../components/ui";
import { useCountUp, useInView } from "../lib/hooks";

export function Strengths() {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <Section id="vision" tone="surface">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHead eyebrow={VISION.eyebrow} title={VISION.title}>
            {VISION.lead}
          </SectionHead>
          {VISION.paragraphs.map((p) => (
            <p key={p} className="mt-5 text-[17px] leading-relaxed text-grey">
              {p}
            </p>
          ))}
          <ul className="mt-6 space-y-3">
            {VISION.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-grey">
                <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-green text-white">
                  <Icon.Check />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
          {STATS.map((s) => (
            <Counter key={s.label} {...s} go={seen} />
          ))}
        </div>
      </div>
      <p className="mt-8 text-sm font-semibold text-grey">
        About 1.38 billion cattle, goats, sheep and horses across Africa, plus the wildlife in its game parks. Our vision for 2045. Livestock figures are FAO estimates for 2024.
      </p>
    </Section>
  );
}

function Counter({ value, suffix, label, format, go }: (typeof STATS)[number] & { go: boolean }) {
  const ref = useCountUp(value, go, format);
  return (
    <div className="card p-7">
      <div className="num text-[44px] font-bold leading-none tracking-tight text-ink">
        <span ref={ref}>0</span>
        <span className="text-green">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-grey">{label}</div>
    </div>
  );
}
