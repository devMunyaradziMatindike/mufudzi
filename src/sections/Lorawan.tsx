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

const COMPARE = [
  {
    title: "LoRaWAN",
    lead: "Free-range pastures and large paddocks",
    points: [
      "Stable link about 2–3 km from tag to farm gateway (up to ~3 km)",
      "Gateway covers roughly 3 km stable / up to ~5 km",
      "No SIM in the ear tag — one gateway backhauls the herd",
      "About 36 months battery at a 4-hour upload interval",
      "Gateway GPS plus temperature, steps, fence and inventory use cases",
    ],
  },
  {
    title: "Bluetooth",
    lead: "Yards, sheds, feedlots and closer management",
    points: [
      "About 100 m open-field broadcast range to the gateway",
      "Gateway uplinks over 4G, Wi‑Fi or Ethernet",
      "Fast temperature and step updates for health and heat watching",
      "About 2+ years battery life in typical broadcast settings",
      "IP68 tag for wash-down, mud and rain",
    ],
  },
];

const LORA_TAG = [
  ["Link", "LoRaWAN · stable ~2 km · up to ~3 km to gateway"],
  ["Bands", "Regional options including EU868, US915, AS923, AU915, CN470 and others"],
  ["Temperature", "0°C–50°C · 0.1°C accuracy between 30°C and 43°C"],
  ["Environment", "Operates −30°C to 60°C"],
  ["Activity", "3-axis accelerometer · step / exercise counting"],
  ["Upload", "Default every 4 hours · adjustable (affects battery life)"],
  ["Battery", "About 36 months at the 4-hour interval"],
  ["Build", "≈13 g · IP67 · 58 × 30 × 9 mm · engineering plastic"],
  ["Roles", "Temperature · steps · base-station fence · automatic inventory"],
  ["Best for", "Free-range cattle, sheep and similar outdoor herds"],
];

const LORA_GW = [
  ["Role", "LoRaWAN network relay between tags and cloud"],
  ["Backhaul", "4G wireless and TCP"],
  ["Coverage", "Maximum ~5 km · stable ~3 km"],
  ["Capacity", "Up to about 1,000 LoRaWAN nodes"],
  ["Positioning", "Built-in GPS on the gateway"],
  ["Power", "AC 220 V or DC 12 V · ≤35 W"],
  ["Climate", "−35°C to 75°C · 0–95% relative humidity"],
  ["Enclosure", "IP65 outdoor housing"],
  ["Size", "About 289 × 217 × 115 mm without antenna"],
  ["Extras", "Status indicators · low-power design · can receive third-party Bluetooth broadcasts"],
];

const BLE_TAG = [
  ["Link", "Bluetooth Low Energy (BLE 4.2 / 5.0)"],
  ["Range", "Up to about 100 m open line of sight"],
  ["Broadcast", "Default every 10 seconds · adjustable"],
  ["Temperature", "±0.1°C from +28°C to +43°C · ±0.5°C from −10°C to +60°C"],
  ["Activity", "Pedometer / step monitoring for health and estrus cues"],
  ["Battery", "CR2032 class cell · ≈225 mAh · about 2.3+ years in typical settings"],
  ["Build", "≈12.4 g with battery · IP68 · PP shell"],
  ["Install", "Ear stud mount for cattle, sheep and pigs"],
  ["Payload", "Can broadcast name, MAC, interval, power, battery, temperature and steps"],
  ["Best for", "Yards, barns and closer daily management"],
];

const BLE_GW = [
  ["Role", "Scans BLE ear tags and forwards data to your servers"],
  ["Uplink", "4G LTE · Wi‑Fi (802.11 b/g/n) · Ethernet WAN/LAN"],
  ["Protocols", "TCP · UDP · MQTT · HTTP"],
  ["Bluetooth", "BLE 4.2 / 5.0 · PA/LNA · scan distance often >100 m"],
  ["Filtering", "By Bluetooth name, signal strength (RSSI) or MAC"],
  ["Power", "DC 6–28 V adapter or PoE (IEEE 802.3at)"],
  ["Climate", "About −20°C to 70°C typical operating range"],
  ["Forms", "Indoor circular housing (~124 mm Ø) or outdoor industrial enclosure"],
  ["Positioning", "Multi-gateway RSSI can support approximate yard location"],
  ["Upgrades", "Remote / OTA firmware update support"],
];

const MONITOR = [
  {
    title: "Body temperature",
    text: "Ear-surface and near-body temperature help spot fever early so you can pull animals sooner.",
  },
  {
    title: "Activity and heat",
    text: "Step counts from the accelerometer flag restlessness and heat behaviour across the herd.",
  },
  {
    title: "Herd inventory",
    text: "Tags that check in with a gateway support automatic head-counts in the yard or paddock.",
  },
  {
    title: "Fence and presence",
    text: "LoRaWAN base-station presence supports electronic-fence style alerts when animals leave coverage.",
  },
  {
    title: "Gateway location",
    text: "The LoRaWAN outdoor gateway carries GPS so you know where the farm relay is sited.",
  },
  {
    title: "Flexible backhaul",
    text: "Bluetooth gateways can use 4G where there is mobile coverage, Wi‑Fi at the homestead, or Ethernet in a shed.",
  },
];

const LORA_STEPS = [
  { title: "Fit the tag", text: "The LoRaWAN temperature tag goes on the ear and starts measuring heat and steps." },
  { title: "Long radio hop", text: "Data travels kilometres to the farm gateway — no cellular SIM inside the tag." },
  { title: "Gateway uplink", text: "The outdoor gateway forwards packets over 4G or TCP and can report its own GPS." },
  { title: "Cloud and phone", text: "Temperature, activity and alerts reach your monitoring screens and app." },
];

const BLE_STEPS = [
  { title: "Fit the BLE tag", text: "The Bluetooth tag broadcasts temperature, steps and battery on a short interval." },
  { title: "Yard gateway scan", text: "One or more Bluetooth gateways pick up tags within about 100 m." },
  { title: "4G / Wi‑Fi / Ethernet", text: "The gateway pushes readings to the cloud using the backhaul you already have on site." },
  { title: "Health view", text: "You watch fever, activity and inventory for animals close to the yard or shed." },
];

function SpecList({ rows }: { rows: string[][] }) {
  return (
    <ul className="mt-6 space-y-3">
      {rows.map(([k, v]) => (
        <li key={k} className="flex gap-3 border-b border-line pb-3 text-[15px] last:border-0">
          <span className="w-28 shrink-0 font-semibold text-ink sm:w-32">{k}</span>
          <span className="text-grey">{v}</span>
        </li>
      ))}
    </ul>
  );
}

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
          <p className="eyebrow">Connected ear tags</p>
          <h1 className="mt-3 max-w-[20ch] text-[clamp(34px,5vw,56px)] font-bold leading-[1.05] tracking-tight text-ink">
            Temperature and activity — LoRaWAN for the range, Bluetooth for the yard.
          </h1>
          <p className="mt-5 max-w-[580px] text-[17px] leading-relaxed text-grey">
            We supply two complementary stacks: long-range LoRaWAN tags with an outdoor 4G gateway for free-range herds,
            and Bluetooth temperature tags with a gateway that uplinks over 4G, Wi‑Fi or Ethernet for closer management.
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
        <div>
          <p className="eyebrow">Which system</p>
          <h2 className="mt-2 max-w-[22ch] text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight text-ink">
            Same job — different radio for different ground.
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {COMPARE.map((c) => (
              <div key={c.title} className="border-t-2 border-green pt-6">
                <h3 className="text-2xl font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-[15px] font-semibold text-green-dark">{c.lead}</p>
                <ul className="mt-5 space-y-3">
                  {c.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-grey">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <figure className="mt-16 overflow-hidden rounded-[28px] bg-ink">
          <img
            src="/images/connected-farm-cloud.jpg"
            alt="Farm sensors and livestock gateway sending data to the cloud and farmer devices"
            className="w-full object-contain"
          />
        </figure>

        {/* LoRaWAN */}
        <div className="mt-20">
          <p className="eyebrow">LoRaWAN system</p>
          <h2 className="mt-2 max-w-[18ch] text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight text-ink">
            Kilometre-scale monitoring without a SIM in every tag.
          </h2>
          <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-grey">
            Tags talk LoRaWAN to a farm gateway. The gateway is the only unit that needs wide-area backhaul (4G or TCP).
            That keeps per-animal hardware light, long-lived and workable where cellular coverage on every animal is
            impractical.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">LoRaWAN ear tag</p>
            <h3 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              Body temperature and activity on the animal.
            </h3>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Lightweight tag for cattle and sheep. A special mechanical layout keeps the reading closer to body
              temperature, while a three-axis sensor counts exercise for health and heat watching. Reusable engineering
              plastic shell, IP67, and multi-region LoRaWAN bands.
            </p>
            <SpecList rows={LORA_TAG} />
          </div>
          <figure className="overflow-hidden rounded-[28px] bg-surface">
            <img
              src="/images/lorawan-hcbl38.png"
              alt="LoRaWAN temperature ear tag and stud"
              className="mx-auto max-h-[420px] w-full object-contain p-8"
            />
          </figure>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <figure className="order-2 overflow-hidden rounded-[28px] bg-ink lg:order-1">
            <img
              src="/images/lorawan-lg86.jpg"
              alt="Outdoor LoRaWAN farm gateway with antennas"
              className="mx-auto max-h-[420px] w-full object-contain p-6"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">LoRaWAN farm gateway</p>
            <h3 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              Outdoor relay with 4G backhaul and GPS.
            </h3>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Standard LoRaWAN network relay: it bridges terminal tags and the network server, converts protocols, and
              forwards traffic over 4G or TCP. Built for harsh sites — wide temperature range, IP65 housing, mains or
              12 V DC — and sized for large herds on a single farm link.
            </p>
            <SpecList rows={LORA_GW} />
          </div>
        </div>

        <div className="mt-16">
          <p className="eyebrow">LoRaWAN path</p>
          <h3 className="mt-2 text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-ink">From the ear to your phone</h3>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {LORA_STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="text-sm font-bold text-green">0{i + 1}</div>
                <h4 className="mt-2 text-lg font-bold text-ink">{s.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-grey">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <figure className="mt-12 overflow-hidden rounded-[28px] bg-ink">
          <img
            src="/images/lorawan-system.jpg"
            alt="LoRaWAN ear tag, shed gateway, 4G uplink, cloud platform and farmer apps"
            className="w-full object-contain"
          />
        </figure>
        <figure className="mt-6 overflow-hidden rounded-[28px] border border-line bg-white">
          <img
            src="/images/lorawan-platform.jpg"
            alt="Ear tag IoT platform flow from devices through ingestion, storage and applications"
            className="w-full object-contain"
          />
        </figure>

        {/* Bluetooth */}
        <div className="mt-24">
          <p className="eyebrow">Bluetooth system</p>
          <h2 className="mt-2 max-w-[20ch] text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight text-ink">
            Yard-scale health tags with 4G, Wi‑Fi or Ethernet uplink.
          </h2>
          <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-grey">
            Bluetooth Low Energy tags broadcast temperature and steps. A multi-network gateway collects those beacons and
            ships them to the cloud over cellular, Wi‑Fi or a wired LAN — ideal when animals are near sheds, crush pens
            or feedlots.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Bluetooth ear tag</p>
            <h3 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              Frequent temperature and step broadcasts.
            </h3>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Ultra-low-power BLE ear tag for cattle, sheep and pigs. It measures ear-surface temperature for fever
              detection and steps for activity and estrus cues, then broadcasts on a configurable interval. IP68 shell
              and multi-year battery life in typical farm settings.
            </p>
            <SpecList rows={BLE_TAG} />
          </div>
          <figure className="overflow-hidden rounded-[28px] bg-surface">
            <img
              src="/images/ble-temp-tag.png"
              alt="Bluetooth temperature ear tag and stud"
              className="mx-auto max-h-[420px] w-full object-contain p-8"
            />
          </figure>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-[24px] border border-line bg-white">
            <img
              src="/images/ble-tag-drawing.jpg"
              alt="Mechanical outline of the temperature ear tag"
              className="h-56 w-full object-contain bg-white p-4 sm:h-64"
            />
            <figcaption className="border-t border-line px-4 py-3 text-sm text-grey">Tag outline and fit geometry</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-[24px] border border-line bg-white">
            <img
              src="/images/ble-applicator.jpg"
              alt="Correct seating of an ear tag in the applicator tool"
              className="h-56 w-full object-contain bg-white p-4 sm:h-64"
            />
            <figcaption className="border-t border-line px-4 py-3 text-sm text-grey">Applicator seating for a clean fit</figcaption>
          </figure>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <figure className="order-2 overflow-hidden rounded-[28px] bg-surface lg:order-1">
            <img
              src="/images/ble-multi-gateway.jpg"
              alt="Bluetooth gateway with 4G, Wi-Fi and Ethernet indicators"
              className="mx-auto max-h-[380px] w-full object-contain p-8"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Bluetooth gateway</p>
            <h3 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              One hub for 4G, Wi‑Fi and Ethernet.
            </h3>
            <p className="mt-4 text-[17px] leading-relaxed text-grey">
              Indoor or outdoor Bluetooth hub that scans nearby tags and sensors, filters by name, RSSI or MAC, and
              forwards payloads with TCP, UDP, MQTT or HTTP. Power from a wide-range DC adapter or PoE. Use Wi‑Fi or
              Ethernet at the homestead, or 4G where only cellular is available.
            </p>
            <SpecList rows={BLE_GW} />
          </div>
        </div>

        <figure className="mt-10 overflow-hidden rounded-[28px] border border-line bg-white">
          <img
            src="/images/ble-gateway-sizes.jpg"
            alt="Indoor circular and outdoor industrial Bluetooth gateway housing options"
            className="w-full object-contain"
          />
          <figcaption className="border-t border-line px-4 py-3 text-sm text-grey">
            Indoor circular housing or rugged outdoor enclosure — choose for shed or exposed sites
          </figcaption>
        </figure>

        <div className="mt-16">
          <p className="eyebrow">Bluetooth path</p>
          <h3 className="mt-2 text-[clamp(22px,2.5vw,30px)] font-bold tracking-tight text-ink">From the yard to the cloud</h3>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BLE_STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="text-sm font-bold text-green">0{i + 1}</div>
                <h4 className="mt-2 text-lg font-bold text-ink">{s.title}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-grey">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20">
          <p className="eyebrow">What you monitor</p>
          <h2 className="mt-2 max-w-[18ch] text-[clamp(26px,3vw,36px)] font-bold leading-tight tracking-tight text-ink">
            Health signals farmers can act on.
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MONITOR.map((m) => (
              <div key={m.title} className="border-t border-line pt-5">
                <h3 className="text-lg font-bold text-ink">{m.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-grey">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-line pt-12">
          <p className="eyebrow">Integration</p>
          <h2 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink">How data leaves the farm</h2>
          <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-grey">
            Gateways can feed cloud platforms through common IoT paths — MQTT subscription, webhooks, platform APIs, or
            direct gateway transmission — so readings land in the same monitoring tools you already use with Mufudzi.
            We help size tags and gateways to your paddocks, yards and backhaul.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-surface px-8 py-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[clamp(24px,3vw,32px)] font-bold tracking-tight text-ink">
              Size LoRaWAN or Bluetooth for your herd.
            </h2>
            <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-grey">
              Book a live demo or message us — we will match free-range LoRaWAN or yard Bluetooth to how you graze and
              manage animals.
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
