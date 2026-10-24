import { Section, SectionHead } from "../components/ui";

const GUIDES = [
  { name: "Pasang Sherpa", role: "Lead guide, Khumbu", since: 2009, summits: "Everest ×4 · Ama Dablam ×11", home: "Phortse, Nepal", accent: "#5b7fa6" },
  { name: "Grace Mollel", role: "Lead guide, Kilimanjaro", since: 2013, summits: "Uhuru Peak ×212", home: "Moshi, Tanzania", accent: "#e23b2e" },
  { name: "Rubén Quispe", role: "Lead guide, Cusco", since: 2011, summits: "Inca Trail ×340 · Salkantay ×60", home: "Ollantaytambo, Peru", accent: "#c9823a" },
  { name: "Tane Hohepa", role: "Guide, Tongariro & Patagonia", since: 2017, summits: "Ruapehu ×58 · W Trek ×22", home: "Tūrangi, Aotearoa", accent: "#3c6e8f" },
];

export function Guides() {
  return (
    <Section id="guides" className="border-t hairline">
      <SectionHead index="03" label="Guides" title={<>People who live on the route.</>}>
        Our lead guides are from the valleys they walk. Small groups — eight at most — and a tail guide on
        every trek, so nobody is ever last alone.
      </SectionHead>
      <div className="mt-16 grid gap-px border hairline bg-line md:grid-cols-2 xl:grid-cols-4">
        {GUIDES.map((g) => (
          <article key={g.name} className="group relative bg-ink p-6">
            <div
              className="mb-10 grid h-24 w-24 place-items-center rounded-full font-serif text-3xl text-ink"
              style={{ background: `linear-gradient(135deg, #f3ead8, ${g.accent})` }}
            >
              {g.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="eyebrow">{g.role}</div>
            <h3 className="mt-2 font-serif text-3xl leading-none">{g.name}</h3>
            <dl className="eyebrow mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <dt className="text-paper/40">Since</dt>
              <dd>{g.since}</dd>
              <dt className="text-paper/40">Summits</dt>
              <dd className="normal-case tracking-normal">{g.summits}</dd>
              <dt className="text-paper/40">Home</dt>
              <dd className="normal-case tracking-normal">{g.home}</dd>
            </dl>
            <span className="absolute right-6 top-6 h-2 w-2 rounded-full" style={{ background: g.accent }} />
          </article>
        ))}
      </div>
    </Section>
  );
}
