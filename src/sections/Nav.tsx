import { useEffect, useRef, useState } from "react";
import { Logo } from "../components/ui";
import { scrollTo } from "../lib/smooth-scroll";

type Link =
  | { id: string; label: string; short?: string; href?: string; button?: boolean }
  | { label: string; short?: string; children: { id: string; label: string; href?: string }[] };

const LINKS: Link[] = [
  {
    label: "Tracker",
    short: "Tracker",
    children: [
      { id: "tracker", label: "Ear tag" },
      { id: "lorawan", label: "LoRaWAN", href: "#lorawan" },
    ],
  },
  { id: "tracker-guide", label: "Herd guide", short: "Herd guide" },
  { id: "pricing", label: "Pricing" },
  { id: "app", label: "Mobile App", short: "App", href: "#download" },
  { id: "why", label: "Why Mufudzi", short: "Why" },
  { id: "remarks", label: "CEO's Remarks", short: "Remarks", href: "#remarks" },
  { id: "demo", label: "Schedule live demo", short: "Book demo", href: "#demo", button: true },
];

const OVERLAYS = ["#download", "#demo", "#remarks", "#terms", "#privacy", "#lorawan"];

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

  const openOverlay = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    location.hash = href;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-colors duration-300 ${solid || overlay ? "bg-white/95 shadow-[0_1px_0_#e4e8de] backdrop-blur-md" : ""}`}>
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-6 px-6">
          <Logo />
          <nav className="hidden items-center gap-6 rounded-full border border-green px-4 text-[14px] font-semibold text-grey lg:flex" aria-label="Main">
            {LINKS.map((l) =>
              "children" in l ? (
                <DesktopDropdown key={l.label} link={l} onGo={go} onOverlay={openOverlay} />
              ) : (
                <NavLink key={l.label} link={l} className="transition hover:text-green-dark" onGo={go} onClose={() => setOpen(false)} />
              ),
            )}
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
            {LINKS.map((l) =>
              "children" in l ? (
                <MobileDropdown key={l.label} link={l} onGo={go} onOverlay={openOverlay} />
              ) : (
                <NavLink
                  key={l.label}
                  link={l}
                  mobile
                  className="block py-2.5 font-semibold"
                  onGo={go}
                  onClose={() => setOpen(false)}
                />
              ),
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

function DesktopDropdown({
  link,
  onGo,
  onOverlay,
}: {
  link: Extract<Link, { children: unknown }>;
  onGo: (id: string) => (e: React.MouseEvent) => void;
  onOverlay: (href: string) => (e: React.MouseEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 transition hover:text-green-dark"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5 L6 7.5 L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 min-w-[160px] -translate-x-1/2 pt-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-[0_16px_40px_-20px_rgba(31,38,26,0.45)]">
            {link.children.map((c) =>
              c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2.5 text-[14px] font-semibold text-grey transition hover:bg-green-soft hover:text-green-dark"
                  onClick={(e) => {
                    setOpen(false);
                    onOverlay(c.href!)(e);
                  }}
                >
                  {c.label}
                </a>
              ) : (
                <a
                  key={c.label}
                  href={`#${c.id}`}
                  className="block px-4 py-2.5 text-[14px] font-semibold text-grey transition hover:bg-green-soft hover:text-green-dark"
                  onClick={(e) => {
                    setOpen(false);
                    onGo(c.id)(e);
                  }}
                >
                  {c.label}
                </a>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileDropdown({
  link,
  onGo,
  onOverlay,
}: {
  link: Extract<Link, { children: unknown }>;
  onGo: (id: string) => (e: React.MouseEvent) => void;
  onOverlay: (href: string) => (e: React.MouseEvent) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line py-1 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2.5 font-semibold"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {link.short ?? link.label}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5 L6 7.5 L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="pb-2 pl-3">
          {link.children.map((c) =>
            c.href ? (
              <a
                key={c.label}
                href={c.href}
                className="block py-2 text-[14px] font-semibold text-grey"
                onClick={onOverlay(c.href)}
              >
                {c.label}
              </a>
            ) : (
              <a
                key={c.label}
                href={`#${c.id}`}
                className="block py-2 text-[14px] font-semibold text-grey"
                onClick={onGo(c.id)}
              >
                {c.label}
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function NavLink({
  link,
  className,
  onGo,
  onClose,
  mobile = false,
}: {
  link: Extract<Link, { id: string }>;
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
