import type { ReactNode } from "react";

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <a href="#top" className={`flex items-center gap-2 ${className}`} aria-label="Mufudzi home">
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#f7f6f1]">
        <img src="/images/mufudzi-logo.jpg" alt="" className="h-[148%] w-[148%] max-w-none object-cover" />
      </span>
      <span className={`text-[22px] font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        mufu<span className="text-green">dzi</span>
      </span>
    </a>
  );
}

export function Section({
  id,
  children,
  className = "",
  tone = "white",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "surface" | "dark";
}) {
  const bg = tone === "surface" ? "bg-surface" : tone === "dark" ? "bg-ink text-white" : "bg-white";
  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 md:py-28">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  children,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`max-w-[760px] ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className={`text-[clamp(30px,4vw,46px)] font-bold leading-[1.08] tracking-tight ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {children && <p className={`mt-5 text-[17px] leading-relaxed ${light ? "text-white/75" : "text-grey"}`}>{children}</p>}
    </div>
  );
}

export function Stars({ n = 5, size = 16 }: { n?: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
          <path
            d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z"
            fill={i < n ? "#fbbc04" : "#e4e8de"}
          />
        </svg>
      ))}
    </span>
  );
}

export const Icon = {
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
};
