import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Section, SectionHead } from "../components/ui";
import { useInView, useMedia } from "../lib/hooks";

const STEPS = [
  {
    title: "Ear tag",
    text: "On the animal, the tag reads its GPS position.",
  },
  {
    title: "Satellite",
    text: "The signal travels up to the satellite.",
  },
  {
    title: "Servers",
    text: "The satellite passes the fix to the servers.",
  },
  {
    title: "Farmer’s phone",
    text: "The accurate location appears on the phone.",
  },
];

export function HowItWorks() {
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const [stageRef, seen] = useInView<HTMLDivElement>("-15% 0px");
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const pulse = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(reduce ? 3 : 0);
  const [line, setLine] = useState({ d: "", w: 0, h: 0 });
  const showPin = reduce || active === 3;

  useEffect(() => {
    setActive(reduce ? 3 : 0);
  }, [reduce]);

  useEffect(() => {
    if (!seen || reduce) return;
    const stage = stageRef.current;
    const dot = pulse.current;
    if (!stage || !dot) return;

    let timeline: gsap.core.Timeline | undefined;
    let last = "";

    const layout = () => {
      const box = stage.getBoundingClientRect();
      const pts = nodes.current.filter(Boolean).map((node) => {
        const r = node!.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (pts.length < 4) return;
      const key = pts.map((p) => `${Math.round(p.x)},${Math.round(p.y)}`).join("|");
      if (key === last) return;
      last = key;
      setLine({
        d: pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" "),
        w: box.width,
        h: box.height,
      });

      timeline?.kill();
      timeline = gsap.timeline({ repeat: -1 });
      timeline.set(dot, { left: pts[0].x, top: pts[0].y, opacity: 1 });
      timeline.call(() => setActive(0));
      pts.slice(1).forEach((p, index) => {
        const step = index + 1;
        timeline!.to(dot, { left: p.x, top: p.y, duration: 0.9, ease: "power1.inOut" });
        timeline!.call(() => setActive(step));
        timeline!.to({}, { duration: step === 3 ? 1.5 : 0.3 });
      });
      timeline.to(dot, { opacity: 0, duration: 0.25 });
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(stage);
    return () => {
      timeline?.kill();
      observer.disconnect();
    };
  }, [seen, reduce, stageRef]);

  return (
    <Section id="signal" className="border-t border-line">
      <SectionHead eyebrow="How it works" title="From the ear tag to the farmer’s phone." align="center">
        The tag uses GPS. That signal reaches a satellite, the satellite delivers it to the servers, and the farmer sees the accurate location.
      </SectionHead>

      <div ref={stageRef} className="relative mt-14">
        {line.w > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${line.w} ${line.h}`}
            aria-hidden
          >
            <path d={line.d} fill="none" stroke="#e4e8de" strokeWidth="2" />
          </svg>
        )}

        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-center gap-5 lg:flex-col lg:items-center lg:text-center">
              <div
                ref={(el) => {
                  nodes.current[i] = el;
                }}
                data-step={i}
                data-active={active === i}
                className={`relative z-10 grid h-28 w-28 shrink-0 place-items-center rounded-[28px] bg-white shadow-sm ring-1 transition ${
                  active === i ? "ring-2 ring-green" : "ring-line"
                }`}
              >
                {i === 0 && <EarTag />}
                {i === 1 && <Satellite />}
                {i === 2 && <Servers />}
                {i === 3 && <Phone showPin={showPin} />}
              </div>
              <div>
                <div className="text-base font-bold text-ink">{step.title}</div>
                <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-grey">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {!reduce && (
          <div
            ref={pulse}
            data-pulse
            aria-hidden
            className="pointer-events-none absolute z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-0"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-green/50" />
            <span className="absolute inset-0 rounded-full bg-green" />
          </div>
        )}
      </div>
    </Section>
  );
}

function EarTag() {
  return (
    <img
      src="/images/mufudzi-ear.jpeg"
      alt=""
      className="h-16 w-16 rounded-2xl object-cover"
    />
  );
}

function Satellite() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16" aria-hidden>
      <rect x="6" y="28" width="18" height="16" rx="2" fill="#eef6df" stroke="#82b718" strokeWidth="2" />
      <rect x="48" y="28" width="18" height="16" rx="2" fill="#eef6df" stroke="#82b718" strokeWidth="2" />
      <rect x="26" y="24" width="20" height="24" rx="5" fill="#1f261a" />
      <circle cx="36" cy="36" r="4" fill="#82b718" />
      <path d="M36 24 V12" stroke="#1f261a" strokeWidth="2" />
      <circle cx="36" cy="10" r="3" fill="#82b718" />
    </svg>
  );
}

function Servers() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16" aria-hidden>
      <rect x="14" y="12" width="44" height="18" rx="4" fill="#1f261a" />
      <rect x="14" y="36" width="44" height="18" rx="4" fill="#1f261a" />
      <circle cx="24" cy="21" r="2.5" fill="#82b718" />
      <circle cx="32" cy="21" r="2.5" fill="#eef6df" />
      <circle cx="24" cy="45" r="2.5" fill="#82b718" />
      <circle cx="32" cy="45" r="2.5" fill="#eef6df" />
      <path d="M36 54 v8 M30 62 h12" stroke="#82b718" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Phone({ showPin }: { showPin: boolean }) {
  return (
    <span className="relative grid h-16 w-16 place-items-center">
      <svg viewBox="0 0 72 72" className="h-16 w-16" aria-hidden>
        <rect x="22" y="6" width="28" height="60" rx="6" fill="#1f261a" />
        <rect x="25" y="14" width="22" height="44" rx="2" fill="#e7f3cf" />
        <path d="M27 44c6-10 12 6 18-6" fill="none" stroke="#6a9a12" strokeWidth="2" />
        <path d="M26 34c8 2 14-6 20-2" fill="none" stroke="#82b718" strokeWidth="2" opacity="0.7" />
        <circle cx="36" cy="10" r="1.2" fill="#82b718" />
      </svg>
      <span
        className={`absolute left-1/2 top-[42%] -translate-x-1/2 transition duration-300 ${
          showPin ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <svg viewBox="0 0 24 32" className="h-6 w-5" aria-hidden>
          <path d="M12 1c5 0 9 4 9 9 0 7-9 20-9 20S3 17 3 10c0-5 4-9 9-9z" fill="#82b718" />
          <circle cx="12" cy="10" r="3.5" fill="#fff" />
        </svg>
      </span>
    </span>
  );
}
