import { useEffect, useState } from "react";
import { Logo } from "../components/ui";
import { scrollTo } from "../lib/smooth-scroll";

const TABS = [
  { id: "top", n: "00", label: "Treks" },
  { id: "lengths", n: "01", label: "Lengths" },
  { id: "included", n: "02", label: "Included" },
  { id: "guides", n: "03", label: "Guides" },
  { id: "when", n: "04", label: "When to go" },
  { id: "faq", n: "05", label: "FAQ" },
];

export function Nav() {
  const [active, setActive] = useState("top");
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    TABS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? "bg-ink/80 backdrop-blur-md" : ""}`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Sections">
          {TABS.map((t) => (
            <a key={t.id} href={`#${t.id}`} onClick={go(t.id)} className={`tab ${active === t.id ? "tab-active" : ""}`}>
              {t.n} {t.label}
            </a>
          ))}
        </nav>
        <a href="#book" onClick={go("book")} className="btn btn-paper">
          <span className="dot" /> Book a trek
        </a>
      </div>
    </header>
  );
}
