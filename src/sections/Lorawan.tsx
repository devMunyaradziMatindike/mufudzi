import { useEffect, useState } from "react";
import { CONTACT } from "../data/content";

export function useLorawanScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#lorawan");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#lorawan");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

const STEPS = [
  {
    title: "Temperature ear tag",
    text: "The tag sits on the ear and reads body temperature and activity.",
  },
  {
    title: "LoRaWAN link",
    text: "Data travels up to about 2–3 km to the farm gateway — no SIM in the tag.",
  },
  {
    title: "Gateway + 4G",
    text: "The gateway relays tag data to the cloud over 4G or TCP, with GPS on the unit.",
  },
  {
    title: "Your phone",
    text: "Temperature, steps and herd status show up in the monitoring app.",
  },
];

const TAG_SPECS = [
  ["Range", "Stable ~2 km · up to ~3 km to gateway"],
  ["Sensors", "Body temperature · step / activity count"],
  ["Accuracy", "0.1°C in the 30–43°C band"],
  ["Battery", "About 36 months at 4-hour uploads"],
  ["Build", "13 g · IP67 · 58 × 30 × 9 mm"],
];

const GW_SPECS = [
  ["Backhaul", "LoRaWAN → 4G / TCP"],
  ["Coverage", "Stable ~3 km · up to ~5 km"],
  ["Capacity", "Up to 1,000 LoRaWAN nodes"],
  ["Positioning", "Built-in GPS on the gateway"],
  ["Outdoor", "IP65 · −35°C to 75°C · AC220V / DC12V"],
];

export function Lorawan() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <div className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 20%, #eef6df 0%, transparent 55%), linear-gradient(165deg, #f7f8f3 0%, #fff 45%, #eef6df 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-6 pb-16 pt-28">
          <p className="eyebrow">LoRaWAN</p>
          <h1 className="mt-3 max-w-[18ch] text-[clamp(34px,5vw,56px)] font-bold leading-[1.05] tracking-tight text-ink">
            Long-range temperature ear tags for free-range herds.
          </h1>
          <p className="mt-5 max-w-[540px] text-[17px] leading-relaxed text-grey">
            A LoRaWAN ear tag and farm gateway pair for body temperature and activity across large grazing areas —
            without a SIM card in every tag.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-green">
              Schedule live demo
            </a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Temperature ear tag</p>
            <h2 className="mt-2 text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight text-ink">
              WE-HCBL38
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Lightweight LoRaWAN tag for cattle and sheep. Measures temperature closer to body heat, counts steps for
              activity and heat detection, and uploads through the farm gateway — reusable and built for outdoor herds.
            </p>
            <ul className="mt-6 space-y-3">
              {TAG_SPECS.map(([k, v]) => (
                <li key={k} className="flex gap-3 border-b border-line pb-3 text-[15px] last:border-0">
                  <span className="w-28 shrink-0 font-semibold text-ink">{k}</span>
                  <span className="text-grey">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="overflow-hidden rounded-[28px] bg-surface">
            <img
              src="/images/lorawan-hcbl38.png"
              alt="WE-HCBL38 LoRaWAN temperature ear tag and stud"
              className="mx-auto max-h-[420px] w-full object-contain p-8"
            />
          </figure>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <figure className="order-2 overflow-hidden rounded-[28px] bg-ink lg:order-1">
            <img
              src="/images/lorawan-lg86.jpg"
              alt="WE-LG86 LoRaWAN gateway with antennas"
              className="mx-auto max-h-[420px] w-full object-contain p-6"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Farm gateway</p>
            <h2 className="mt-2 text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight text-ink">
              WE-LG86
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Outdoor LoRaWAN gateway that collects tag traffic and forwards it to the cloud over 4G or TCP. Built-in GPS,
              weatherproof housing, and capacity for large herds on one farm link.
            </p>
            <ul className="mt-6 space-y-3">
              {GW_SPECS.map(([k, v]) => (
                <li key={k} className="flex gap-3 border-b border-line pb-3 text-[15px] last:border-0">
                  <span className="w-28 shrink-0 font-semibold text-ink">{k}</span>
                  <span className="text-grey">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 max-w-[20ch] text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight text-ink">
            From the ear to your phone.
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="text-sm font-bold text-green">0{i + 1}</div>
                <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-grey">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <figure className="mt-16 overflow-hidden rounded-[28px] bg-ink">
          <img
            src="/images/lorawan-system.jpg"
            alt="LoRaWAN ear tag, gateway, cloud and app architecture"
            className="w-full object-contain"
          />
        </figure>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-surface px-8 py-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink">See LoRaWAN on your farm.</h2>
            <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-grey">
              Book a live demo or message us — we will help you size tags and gateways for your herd.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-green">
              Schedule live demo
            </a>
            <a href={`tel:${CONTACT.phoneIntl}`} className="btn btn-ghost">
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
