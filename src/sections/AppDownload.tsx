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
    text: "Follow directions to the animal’s live position.",
  },
  {
    title: "Replay the path",
    text: "Play back the route the animal walked.",
  },
  {
    title: "Fence alarm",
    text: "Phone rings if the animal leaves the fence.",
  },
  {
    title: "Live refresh",
    text: "Location updates about every 5 seconds.",
  },
];

export function AppDownload() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-[960px] flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:pt-24">
        <div className="text-center">
          <h1 className="text-[clamp(22px,4.5vw,40px)] font-bold leading-tight tracking-tight text-ink">
            Get the app.
          </h1>
          <p className="mx-auto mt-1.5 max-w-[520px] text-[12px] leading-snug text-grey sm:mt-3 sm:text-[16px] sm:leading-relaxed">
            See the app while connected to a tracker. Download for iPhone or Android.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
          <a href={CONTACT.appStore} target="_blank" rel="noreferrer" className="block">
            <img
              src="/images/badge-app-store.svg"
              alt="Download Mufudzi on the App Store"
              className="h-9 w-auto sm:h-14"
            />
          </a>
          <a href={CONTACT.apk} download="Mufudzi Tracking App.apk" className="block">
            <img
              src="/images/badge-google-play.png"
              alt="Download the Mufudzi Tracking App"
              className="h-11 w-auto sm:h-[84px]"
            />
          </a>
        </div>

        <div className="mt-4 grid w-full grid-cols-[minmax(0,38%)_minmax(0,1fr)] items-center gap-3 sm:mt-8 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10">
          <figure className="overflow-hidden rounded-[18px] border border-line bg-ink shadow-[0_16px_40px_-24px_rgba(31,38,26,0.5)] sm:rounded-[28px]">
            <video
              className="aspect-[9/19] w-full object-cover"
              src="/images/mufudzi-app-demo.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="auto"
              aria-label="Screen recording of the Mufudzi app connected to a tracker"
            />
          </figure>

          <div className="min-w-0 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-green sm:text-[12px]">
              Major features
            </p>
            <h2 className="mt-0.5 text-[14px] font-bold leading-tight tracking-tight text-ink sm:mt-2 sm:text-[clamp(22px,3vw,32px)]">
              What you can do in the app
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-2 sm:mt-6 sm:gap-x-6 sm:gap-y-5">
              {FEATURES.map((f) => (
                <li key={f.title} className="border-t border-line pt-1.5 sm:pt-3">
                  <h3 className="text-[11px] font-bold leading-snug text-ink sm:text-base lg:text-lg">{f.title}</h3>
                  <p className="mt-0.5 text-[10px] leading-snug text-grey sm:mt-1.5 sm:text-[14px] sm:leading-relaxed">
                    {f.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
