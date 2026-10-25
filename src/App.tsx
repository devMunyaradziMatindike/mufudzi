import { useEffect } from "react";
import { startSmoothScroll } from "./lib/smooth-scroll";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Pillars } from "./sections/Pillars";
import { Solutions } from "./sections/Solutions";
import { Strengths } from "./sections/Strengths";
import { Pricing } from "./sections/Pricing";
import { HowItWorks } from "./sections/HowItWorks";
import { Partners } from "./sections/Partners";
import { Footer } from "./sections/Footer";
import { AppDownload, useDownloadScreen } from "./sections/AppDownload";
import { ScheduleDemo, useDemoScreen } from "./sections/ScheduleDemo";

export default function App() {
  const download = useDownloadScreen();
  const demo = useDemoScreen();
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <Nav />
      {download && <AppDownload />}
      {demo && <ScheduleDemo />}
      <main>
        <Hero />
        <Pricing />
        <HowItWorks />
        <Pillars />
        <Solutions />
        <Strengths />
        <Partners />
      </main>
      <Footer />
    </>
  );
}
