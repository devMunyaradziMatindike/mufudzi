import { useEffect, useState } from "react";
import { PRIVACY_BODY } from "../data/privacy";
import { parseLegalBody, renderLegalBlocks } from "../lib/legal-doc";
import { closeOverlay } from "../lib/close-overlay";

export function usePrivacyScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#privacy");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#privacy");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

export function Privacy() {
  const blocks = parseLegalBody(PRIVACY_BODY, {
    ruleLines: ["Mufudzi Privacy Policy |"],
    scheduleSubheads: [
      "Short notice for account creation",
      "Short notice for an invited user or alert recipient",
      "Privacy notice acknowledgement",
      "Separate optional marketing choices",
      "Separate written consent where legally required",
    ],
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
