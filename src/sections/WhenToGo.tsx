import { TREKS } from "../data/treks";
import { activeStore } from "../lib/store";
import { scrollTo } from "../lib/smooth-scroll";
import { Section, SectionHead } from "../components/ui";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/** 0 = closed/not recommended, 1 = shoulder, 2 = prime */
const WINDOWS: Record<string, number[]> = {
  tongariro: [2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2],
  inca: [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0],
  wtrek: [2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2],
  kilimanjaro: [2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 2],
  ebc: [0, 1, 2, 2, 2, 0, 0, 0, 1, 2, 2, 1],
};

export function WhenToGo() {
  return (
    <Section id="when" className="border-t hairline">
      <SectionHead index="04" label="When to go" title={<>Seasons, not dates.</>}>
        Dry seasons in red. Shoulder months are quieter and colder; we run them with smaller groups. Fixed
        departures are published each November.
      </SectionHead>

      <div className="mt-16 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="eyebrow">
              <th className="py-3 text-left font-normal">Trek</th>
              {MONTHS.map((m, i) => (
                <th key={i} className="w-12 py-3 text-center font-normal">
                  {m}
                </th>
              ))}
              <th className="py-3 text-right font-normal">Season</th>
            </tr>
          </thead>
          <tbody>
            {TREKS.map((t, idx) => (
              <tr key={t.id} className="border-t hairline">
                <td className="py-5 pr-6">
                  <button
                    onClick={() => {
                      activeStore.set(idx);
                      scrollTo("#top");
                    }}
                    className="text-left"
                  >
                    <span className="eyebrow !text-red">{t.index}</span>
                    <span className="ml-3 font-serif text-2xl leading-none">{t.name}</span>
                  </button>
                </td>
                {WINDOWS[t.id].map((v, i) => (
                  <td key={i} className="py-5 text-center">
                    <span
                      className="mx-auto block h-8 w-6 rounded-sm"
                      style={{
                        background: v === 2 ? t.accent : v === 1 ? `${t.accent}55` : "transparent",
                        border: v === 0 ? "1px solid #1c2537" : undefined,
                      }}
                    />
                  </td>
                ))}
                <td className="eyebrow py-5 text-right">{t.season}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
