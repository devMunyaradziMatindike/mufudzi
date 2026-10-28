import { useEffect, useState } from "react";
import { TERMS_BODY } from "../data/terms";
import { parseLegalBody, renderLegalBlocks } from "../lib/legal-doc";
import { closeOverlay } from "../lib/close-overlay";

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
      <button
        type="button"
        className="fixed right-4 top-4 z-50 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm hover:border-green"
        onClick={closeOverlay}
      >
        Close
      </button>
      <article className="mx-auto max-w-[860px] px-6 pb-20 pt-28">{renderLegalBlocks(blocks)}</article>
    </div>
  );
}
