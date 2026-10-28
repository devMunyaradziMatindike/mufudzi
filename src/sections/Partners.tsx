const PARTNERS = [
  {
    name: "Musikawedu",
    href: "https://musikawedu.com",
    src: "/images/partner-musikawedu.png",
  },
];

export function Partners() {
  return (
    <section className="border-t border-line bg-white" aria-label="Official partners">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <div className="eyebrow">Official partners</div>
        <h2 className="mt-3 max-w-[640px] text-[clamp(28px,3.5vw,40px)] font-bold leading-tight tracking-tight">
          Mufudzi is an official product of Musikawedu.
        </h2>
        <div className="mt-10">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={p.name}
              className="flex h-28 max-w-[420px] items-center justify-center rounded-[20px] border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-green"
            >
              <img src={p.src} alt="" className="max-h-16 max-w-[220px] object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
