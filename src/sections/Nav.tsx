import { useEffect, useState } from "react";
import { Logo } from "../components/ui";
import { scrollTo } from "../lib/smooth-scroll";

const LINKS: { id: string; label: string; short?: string; href?: string; button?: boolean }[] = [
  { id: "tracker", label: "Tracker" },
  { id: "tracker-guide", label: "Herd guide", short: "Herd guide" },
  { id: "pricing", label: "Pricing" },
  { id: "app", label: "Mobile App", short: "App", href: "#download" },
  { id: "why", label: "Why Mufudzi", short: "Why" },
  { id: "remarks", label: "CEO's Remarks", short: "Remarks", href: "#remarks" },
  { id: "demo", label: "Schedule live demo", short: "Book demo", href: "#demo", button: true },
];

const OVERLAYS = ["#download", "#demo", "#remarks", "#terms", "#privacy"];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [overlay, setOverlay] = useState(() => OVERLAYS.includes(window.location.hash));
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    const onHash = () => setOverlay(OVERLAYS.includes(window.location.hash));
    on();
    onHash();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (OVERLAYS.includes(location.hash)) {
      history.pushState(null, "", `${location.pathname}${location.search}`);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    scrollTo(`#${id}`, -72);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-colors duration-300 ${solid || overlay ? "bg-white/95 shadow-[0_1px_0_#e4e8de] backdrop-blur-md" : ""}`}>
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-6 px-6">
          <Logo />
          <nav className="hidden items-center gap-6 rounded-full border border-green px-4 text-[14px] font-semibold text-grey lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.label} link={l} className="transition hover:text-green-dark" onGo={go} onClose={() => setOpen(false)} />
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 block h-0.5 w-4 bg-ink transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] block h-0.5 w-4 bg-ink transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[12px] block h-0.5 w-4 bg-ink transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        {open && (
          <nav className="mx-6 mb-4 rounded-2xl border border-green bg-white px-6 py-4 lg:hidden" aria-label="Mobile">
            {LINKS.map((l) => (
              <NavLink
                key={l.label}
                link={l}
                mobile
                className="block py-2.5 font-semibold"
                onGo={go}
                onClose={() => setOpen(false)}
              />
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({
  link,
  className,
  onGo,
  onClose,
  mobile = false,
}: {
  link: (typeof LINKS)[number];
  className: string;
  onGo: (id: string) => (e: React.MouseEvent) => void;
  onClose: () => void;
  mobile?: boolean;
}) {
  const label = mobile && link.short ? link.short : link.label;
  if (link.href) {
    const external = link.href.startsWith("http");
    return (
      <a
        href={link.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={link.button ? "btn btn-green btn-sm" : className}
        onClick={onClose}
      >
        {label}
      </a>
    );
  }
  return (
    <a href={`#${link.id}`} onClick={onGo(link.id)} className={className}>
      {label}
    </a>
  );
}
