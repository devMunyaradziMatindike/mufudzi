import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { loadHeightmap, type Heightmap } from "./terrain";

export function useHeightmap(id: string): Heightmap | null {
  const [hm, setHm] = useState<Heightmap | null>(null);
  useEffect(() => {
    let live = true;
    loadHeightmap(id).then((h) => live && setHm(h));
    return () => {
      live = false;
    };
  }, [id]);
  return hm;
}

export function useMedia(query: string) {
  const [m, setM] = useState(() => (typeof window !== "undefined" ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return m;
}

/** Typewriter rotation through a list of words. */
export function useTyped(words: string[], { type = 110, back = 55, hold = 1700, start = 500 } = {}) {
  const [text, setText] = useState("");
  const key = words.join("|");
  useEffect(() => {
    let w = 0,
      i = 0,
      deleting = false,
      timer = 0;
    const tick = () => {
      const word = words[w];
      if (!deleting) {
        i++;
        setText(word.slice(0, i));
        if (i >= word.length) {
          deleting = true;
          timer = window.setTimeout(tick, hold);
          return;
        }
        timer = window.setTimeout(tick, type);
      } else {
        i--;
        setText(word.slice(0, i));
        if (i <= 0) {
          deleting = false;
          w = (w + 1) % words.length;
        }
        timer = window.setTimeout(tick, back);
      }
    };
    timer = window.setTimeout(tick, start);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, type, back, hold, start]);
  return text;
}

/** Fires once when the element scrolls into view. */
export function useInView<T extends Element>(rootMargin = "-10% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, seen]);
  return [ref, seen] as const;
}

/** Tweens a number into a span when `go` becomes true. */
export function useCountUp(target: number, go: boolean, format: (n: number) => string, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!go || !ref.current) return;
    const o = { v: 0 };
    const tw = gsap.to(o, {
      v: target,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = format(o.v);
      },
    });
    return () => {
      tw.kill();
    };
  }, [go, target, format, duration]);
  return ref;
}
