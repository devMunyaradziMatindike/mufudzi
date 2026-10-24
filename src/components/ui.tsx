import type { ReactNode } from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className}`}>
      <svg width="28" height="24" viewBox="0 0 32 28" aria-hidden>
        <path d="M2 26 L12 4 L18 14 L21 9 L30 26 Z" fill="#f3ead8" />
        <path d="M12 4 L18 14 L15 19 L9 12 Z" fill="#e23b2e" />
      </svg>
      <span className="font-serif text-lg tracking-tight">Fold Line</span>
    </a>
  );
}

export function SectionHead({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <div className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-red">{index}</span>
          <span>{label}</span>
        </div>
        <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">{title}</h2>
      </div>
      {children && <div className="text-sm leading-relaxed text-paper/65 md:col-span-4 md:col-start-9">{children}</div>}
    </div>
  );
}

export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-[1400px] px-5 py-24 md:px-10 md:py-36 ${className}`}>
      {children}
    </section>
  );
}

export const Arrow = ({ dir = "right" }: { dir?: "left" | "right" }) => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}>
    <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
