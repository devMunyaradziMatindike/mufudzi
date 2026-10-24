import { Section, SectionHead } from "../components/ui";

const QA = [
  ["How fit do I need to be?", "Comfortable walking 6–8 hours a day on rough ground with a 6 kg pack, for consecutive days. For the two high treks we ask for a few months of hill walking beforehand. Nothing technical — no ropes, no crampons."],
  ["What about altitude?", "Our itineraries build in acclimatisation days and 'climb high, sleep low' profiles. Guides check oxygen saturation twice a day above 3 500 m and carry emergency oxygen. Turning around is always an option and never a failure."],
  ["How big are the groups?", "Eight at most, often fewer. Two guides on every departure. Private departures are available for four or more."],
  ["Can I join alone?", "Most people do. Shared tents are matched by gender; a single supplement gets you your own."],
  ["How accurate are the maps on this site?", "The 3D terrain is built from the public AWS Terrain Tiles elevation dataset at 30–90 m resolution, with 1.6× vertical exaggeration so the shape reads. Routes are hand-traced waypoint lines along the real trails, so distances and climbs are measured from the model, not quoted. A trace cuts corners a trail doesn't, so the walked distance is longer — your guide's briefing has the official figures."],
  ["What's your cancellation policy?", "Full refund minus permit costs up to 60 days before departure; 50% up to 30 days; after that we can usually move you to a later date."],
];

export function FAQ() {
  return (
    <Section id="faq" className="border-t hairline">
      <SectionHead index="05" label="FAQ" title={<>The usual questions.</>} />
      <div className="mt-16 border-t hairline">
        {QA.map(([q, a]) => (
          <details key={q} className="group border-b hairline">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-2xl leading-none [&::-webkit-details-marker]:hidden">
              {q}
              <span className="eyebrow shrink-0 transition group-open:rotate-45">+</span>
            </summary>
            <p className="max-w-[720px] pb-7 text-sm leading-relaxed text-paper/65">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
