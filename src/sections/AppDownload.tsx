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

const FEATURES = [
  {
    title: "Navigate to a lost animal",
    text: "Open the app and follow directions to the animal’s live position.",
  },
  {
    title: "Replay the path",
    text: "Play back the route the animal walked.",
  },
  {
    title: "Fence alarm",
    text: "Set a fence; the phone rings if the animal leaves it.",
  },
  {
    title: "Live refresh",
    text: "Location updates about every 5 seconds while connected.",
  },
];

export function AppDownload() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <div className="mx-auto flex min-h-full max-w-[960px] flex-col items-center justify-center px-6 pb-16 pt-28">
        <div className="max-w-[560px] text-center">
          <h1 className="text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight text-ink">
            Get the app.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-grey">
            See the app while connected to a tracker. Then download Mufudzi on the App Store, or get the Android app.
          </p>
        </div>

        <div className="mt-10 grid w-full items-center gap-10 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <figure className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[28px] border border-line bg-ink shadow-[0_24px_60px_-28px_rgba(31,38,26,0.55)]">
            <video
              className="aspect-[9/19] w-full object-cover"
              src="/images/mufudzi-app-demo.mp4"
              controls
              playsInline
              muted
              loop
              preload="metadata"
              aria-label="Screen recording of the Mufudzi app connected to a tracker"
            />
          </figure>

          <div className="text-left">
            <p className="eyebrow">Major features</p>
            <h2 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight text-ink">
              What you can do in the app
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f.title} className="border-t border-line pt-4">
                  <h3 className="text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-grey">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a href={CONTACT.appStore} target="_blank" rel="noreferrer" className="block">
            <img src="/images/badge-app-store.svg" alt="Download Mufudzi on the App Store" className="h-14 w-auto" />
          </a>
          <a href={CONTACT.apk} download="Mufudzi Tracking App.apk" className="block">
            <img src="/images/badge-google-play.png" alt="Download the Mufudzi Tracking App" className="h-[84px] w-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
