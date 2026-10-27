import { useEffect, useState } from "react";
import { TERMS_BODY } from "../data/terms";
import { parseLegalBody, renderLegalBlocks } from "../lib/legal-doc";

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
  const blocks = parseLegalBody(TERMS_BODY, {
    introHeadings: ["Customer Notice", "Important Product Limitations"],
    scheduleSubheads: ["Customer acknowledgement", "Separate optional permissions", "Electronic acceptance wording"],
  });
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <article className="mx-auto max-w-[860px] px-6 pb-20 pt-28">{renderLegalBlocks(blocks)}</article>
    </div>
  );
}
