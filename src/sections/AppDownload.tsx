import { useEffect, useState } from "react";
import { CONTACT } from "../data/content";

export function useDownloadScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#download");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#download");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

export function AppDownload() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <div className="mx-auto flex min-h-full max-w-[720px] flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <h1 className="text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight text-ink">
          Get the app.
        </h1>
        <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-grey">
          Download TraceSky on the App Store, or get the Android app.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={CONTACT.appStore} target="_blank" rel="noreferrer" className="block">
            <img src="/images/badge-app-store.svg" alt="Download TraceSky on the App Store" className="h-14 w-auto" />
          </a>
          <a href={CONTACT.apk} download="Mufudzi Tracking App.apk" className="block">
            <img src="/images/badge-google-play.png" alt="Download the Mufudzi Tracking App" className="h-[84px] w-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
