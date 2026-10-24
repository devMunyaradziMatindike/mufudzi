import { Section, SectionHead } from "../components/ui";

const IN = [
  ["Guides", "Two per group: a lead and a tail. Wilderness first aid, local permits, and more summits than you'd think."],
  ["Porters & crew", "On Kilimanjaro, the Inca Trail and the Khumbu, a fairly paid local crew carries camp. You carry a day pack."],
  ["Camp", "Four-season tents, a mess tent, hot food three times a day and a basin of warm water each morning."],
  ["Permits & park fees", "National park entry, camping, Inca Trail permits, TIMS and Sagarmatha fees, all handled."],
  ["Oxygen & medical", "Pulse oximeter checks twice daily above 3 500 m, emergency oxygen and a comprehensive kit on every high trek."],
  ["Transfers", "Airport pickups, trailhead transport and the flight to Lukla where that applies."],
];
const OUT = [
  ["Flights", "To the gateway city. We send fare advice once your dates are fixed."],
  ["Insurance", "Mandatory, and it must cover trekking to the high point of your route plus helicopter evacuation."],
  ["Tips", "Guideline amounts are on the pre-departure sheet. Never obligatory, always appreciated."],
  ["Personal kit", "Boots, layers, sleeping bag. Rental is available for the expensive items."],
];

export function Included() {
  return (
    <Section id="included" className="border-t hairline">
      <SectionHead index="02" label="Included" title={<>Everything but the boots.</>}>
        One price, printed on the card. The map folds out; the small print doesn't.
      </SectionHead>
      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="dot" /> In the price
          </div>
          <dl className="grid gap-px border hairline bg-line sm:grid-cols-2">
            {IN.map(([h, p]) => (
              <div key={h} className="bg-ink p-6">
                <dt className="font-serif text-2xl leading-none">{h}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-paper/60">{p}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 border border-paper/50" /> Not in the price
          </div>
          <ul className="divide-y divide-line border-y hairline">
            {OUT.map(([h, p]) => (
              <li key={h} className="py-5">
                <div className="font-serif text-xl leading-none">{h}</div>
                <div className="mt-2 text-sm leading-relaxed text-paper/60">{p}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
