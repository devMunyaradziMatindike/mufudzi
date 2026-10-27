import { useEffect, useState } from "react";
import { TERMS_BODY } from "../data/terms";

export function useTermsScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#terms");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#terms");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

export function Terms() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <article className="mx-auto max-w-[860px] px-6 pb-20 pt-28">
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{TERMS_BODY}</div>
      </article>
    </div>
  );
}
