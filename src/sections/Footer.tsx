import { CONTACT } from "../data/content";
import { Logo, Icon } from "../components/ui";

const COLS: [string, [string, string][]][] = [
  [
    "Tracker",
    [
      ["See the tracker", "#tracker"],
      ["Herd guide", "#tracker-guide"],
      ["Pricing", "#pricing"],
      ["Why Mufudzi", "#why"],
      ["Vision 2045", "#vision"],
    ],
  ],
  [
    "Animals",
    [
      ["Cattle", "#why"],
      ["Sheep", "#why"],
      ["Goats", "#why"],
      ["Horses", "#why"],
    ],
  ],
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo light />
            <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-white/60">
              Mufudzi is an official product of Musikawedu. Mufudzi GPS locator for cattle, sheep, goats and
              horses. From pasture to pixel — tracking Africa’s livestock and game-park wildlife by 2045.
            </p>
          </div>
          {COLS.map(([h, items]) => (
            <div key={h} className="lg:col-span-2">
              <div className="text-sm font-bold">{h}</div>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <div className="text-sm font-bold">Contact</div>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <a href={CONTACT.whatsappUrl} className="flex items-center gap-2 hover:text-white" target="_blank" rel="noreferrer">
                  <Icon.WhatsApp /> WhatsApp {CONTACT.whatsapp}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-2 hover:text-white">
                  <Icon.Phone /> {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white">
                  <Icon.Mail /> {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <span className="text-sm text-white/55">© {new Date().getFullYear()} Mufudzi · an official product of Musikawedu</span>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-white/80">
            <a href="#terms" className="underline-offset-4 hover:text-white hover:underline">
              Terms and conditions
            </a>
            <a href="#privacy" className="underline-offset-4 hover:text-white hover:underline">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
