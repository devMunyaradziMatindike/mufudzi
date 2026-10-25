import { ANIMALS, WHY } from "../data/content";
import { Section, SectionHead } from "../components/ui";

const ICONS = [
  <>
    <path key="body" d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path key="chip" d="M9 12h6v6H9z" />
  </>,
  <>
    <path key="arc" d="M5 10a9 9 0 0 1 14 0" />
    <path key="mid" d="M8 13.5a5 5 0 0 1 8 0" />
    <path key="dot" d="M12 17h.01" />
    <path key="off" d="M4 4l16 16" />
  </>,
  <>
    <circle key="core" cx="12" cy="12" r="4" />
    <path key="rays" d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </>,
  <>
    <path key="post" d="M12 4v16" />
    <path key="beam" d="M6 8h12" />
    <path key="left" d="M6 8 3.5 14h5z" />
    <path key="right" d="M18 8 15.5 14h5z" />
  </>,
];

export function Pillars() {
  return (
    <Section id="why">
      <SectionHead eyebrow="Why Mufudzi" title="A small locator for livestock or outdoor operation">
        Built for livestock and outdoor work — farm, retail and home use.
      </SectionHead>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY.map((p, i) => (
          <div key={p.title} className="card p-6">
            <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-green-soft text-green-dark">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[i]}
              </svg>
            </div>
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-grey">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold">Made for your animals</h3>
        <p className="mt-2 text-grey">Use: cattle · Type: animals · Also suited to sheep, goats and horses.</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ANIMALS.map((a) => (
            <li key={a} className="card px-5 py-4">
              <div className="font-bold">{a}</div>
              <div className="text-sm text-grey">Livestock GPS</div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
