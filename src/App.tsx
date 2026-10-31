import { useEffect } from "react";
import { startSmoothScroll } from "./lib/smooth-scroll";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Pillars } from "./sections/Pillars";
import { Solutions } from "./sections/Solutions";
import { Strengths } from "./sections/Strengths";
import { Pricing } from "./sections/Pricing";
import { TrackerGuide } from "./sections/TrackerGuide";
import { HowItWorks } from "./sections/HowItWorks";
import { Partners } from "./sections/Partners";
import { Footer } from "./sections/Footer";
import { AppDownload, useDownloadScreen } from "./sections/AppDownload";
import { ScheduleDemo, useDemoScreen } from "./sections/ScheduleDemo";
import { CeoRemarks, useRemarksScreen } from "./sections/CeoRemarks";
import { Lorawan, useLorawanScreen } from "./sections/Lorawan";
import { Terms, useTermsScreen } from "./sections/Terms";
import { Privacy, usePrivacyScreen } from "./sections/Privacy";

export default function App() {
  const download = useDownloadScreen();
  const demo = useDemoScreen();
  const remarks = useRemarksScreen();
  const lorawan = useLorawanScreen();
  const terms = useTermsScreen();
  const privacy = usePrivacyScreen();
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <Nav />
      {download && <AppDownload />}
      {demo && <ScheduleDemo />}
      {remarks && <CeoRemarks />}
      {lorawan && <Lorawan />}
      {terms && <Terms />}
      {privacy && <Privacy />}
      <main>
        <Hero />
        <Solutions />
        <HowItWorks />
        <Pillars />
        <TrackerGuide />
        <Pricing />
        <Strengths />
        <Partners />
      </main>
      <Footer />
    </>
  );
}
