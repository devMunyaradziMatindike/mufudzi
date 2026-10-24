import { useEffect } from "react";
import { startSmoothScroll } from "./lib/smooth-scroll";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Trail } from "./sections/Trail";
import { Lengths } from "./sections/Lengths";
import { Included } from "./sections/Included";
import { Guides } from "./sections/Guides";
import { WhenToGo } from "./sections/WhenToGo";
import { FAQ } from "./sections/FAQ";
import { Footer } from "./sections/Footer";

export default function App() {
  useEffect(() => {
    startSmoothScroll();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Trail />
        <Lengths />
        <Included />
        <Guides />
        <WhenToGo />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
