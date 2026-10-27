import { useEffect, useState } from "react";

export function useRemarksScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#remarks");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#remarks");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

function Verse({ cite, children }: { cite: string; children: string }) {
  return (
    <blockquote className="my-5 border-l-2 border-green pl-4">
      <p className="text-[13px] font-semibold text-green-dark">{cite}</p>
      <p className="mt-1 whitespace-pre-line text-[17px] leading-relaxed text-ink">{children}</p>
    </blockquote>
  );
}

export function CeoRemarks() {
  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-white">
      <article className="mx-auto max-w-[860px] px-6 pb-20 pt-28">
        <div className="grid grid-cols-[minmax(0,1fr)_42%] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_280px] sm:gap-8">
          <div>
            <p className="eyebrow">CEO&apos;s Remarks</p>
            <h1 className="mt-3 text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight text-ink">
              From the Co-Founder&apos;s Desk
            </h1>
          </div>
          <img
            src="/images/ceo.jpg"
            alt="Munyaradzi Matindike with cattle on the family farm"
            className="w-full rounded-[20px] object-cover shadow-[0_16px_40px_-24px_rgba(31,38,26,0.6)]"
          />
        </div>
        <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink">
          <p>Welcome to Mufudzi.</p>
          <p>
            I grew up herding cattle on our family farm in Mashonaland West, along Ngezi Mine Road. In those grazing fields, I learned patience, responsibility and the close attention that animals need. I also came to understand what livestock means to a farming family: food, school fees, farming power, savings and an inheritance for the next generation.
          </p>
          <p>
            Our farm lies beside a busy road where 42-metre-long abnormal trucks carry platinum ore. I have witnessed the painful reality of cattle being struck by vehicles, while others are lost to cattle rustlers. Behind every animal lost is a household whose hard work and hopes have suffered a blow.
          </p>
          <p>
            Mufudzi was born from these experiences and a conviction that farmers deserve better tools to watch over the animals entrusted to them.
          </p>
          <p>My faith gives this mission its foundation. Genesis 1:26 (KJV) declares:</p>
          <Verse cite="Genesis 1:26 (KJV)">
            “And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.”
          </Verse>
          <p>
            I understand that dominion as a call to responsible stewardship—to care for living creatures with wisdom, compassion and diligence.
          </p>
          <p>Psalm 50:10–11 (KJV) reminds us:</p>
          <Verse cite="Psalm 50:10–11 (KJV)">
            {`“For every beast of the forest is mine, and the cattle upon a thousand hills.
I know all the fowls of the mountains: and the wild beasts of the field are mine.”`}
          </Verse>
          <p>
            These words connect the cattle on our farms with the wildlife in Africa’s game parks. Both form part of a living inheritance that we have a responsibility to care for.
          </p>
          <p>That responsibility is expressed plainly in Proverbs 12:10 (KJV):</p>
          <Verse cite="Proverbs 12:10 (KJV)">
            “A righteous man regardeth the life of his beast: but the tender mercies of the wicked are cruel.”
          </Verse>
          <p>
            At Mufudzi, we seek to put that care into practice through tracking technology. We help farmers follow their animals’ movements and receive information that supports timely action when livestock stray or move unexpectedly.
          </p>
          <p>
            One of the greatest strengths of our solution is its use of satellite communication to support tracking even in areas without cellular network coverage. Across remote grazing lands and game parks, this capability helps those responsible for animals maintain visibility where distance and isolation make daily oversight difficult.
          </p>
          <p>The principle guiding this work was written long before tracking technology existed. Proverbs 27:23 (KJV) says:</p>
          <Verse cite="Proverbs 27:23 (KJV)">
            “Be thou diligent to know the state of thy flocks, and look well to thy herds.”
          </Verse>
          <p>
            For me, this verse captures the heart of Mufudzi. Knowing where an animal is gives its keeper a starting point for action: searching for missing livestock, investigating unusual movement or bringing a straying herd away from danger.
          </p>
          <p>Our Vision 2045 is to become the digital shepherd for Africa.</p>
          <p>
            Our ambition encompasses approximately 399 million cattle, 534 million goats, 439 million sheep and 7.7 million horses—about 1.38 billion domestic animals across the continent. By 2045, we aim to have those herds digitized and tracked, giving farmers better information to support their care and protection.
          </p>
          <p>The same vision extends to wildlife in Africa’s game parks.</p>
          <p>
            There is no single comprehensive census covering every animal in those parks. Our mission is therefore centred on the tracking work itself: helping conservation teams know where animals are, understand their movements and strengthen their protection.
          </p>
          <p>
            Reaching this goal will require lasting partnerships with farmers, herders, conservation organisations, governments and technology providers. Their experience and local knowledge will be essential as we work across Africa’s different landscapes and communities.
          </p>
          <p>Our mission also recognises the relationship between stewardship and prosperity. Deuteronomy 8:18 (KJV) says:</p>
          <Verse cite="Deuteronomy 8:18 (KJV)">
            “But thou shalt remember the LORD thy God: for it is he that giveth thee power to get wealth, that he may establish his covenant which he sware unto thy fathers, as it is this day.”
          </Verse>
          <p>
            These words remind me to approach enterprise with gratitude and accountability. The ability to innovate, build and create wealth carries a responsibility to serve others. Through Mufudzi, I want to help families preserve what they have worked for, strengthen their farming businesses and pass something lasting to their children.
          </p>
          <p>That spirit of care must extend beyond our own boundaries. Deuteronomy 22:1 (KJV) instructs:</p>
          <Verse cite="Deuteronomy 22:1 (KJV)">
            “Thou shalt not see thy brother's ox or his sheep go astray, and hide thyself from them: thou shalt in any case bring them again unto thy brother.”
          </Verse>
          <p>
            This is a call to look out for one another. A neighbour’s missing animal deserves our attention. A threatened herd deserves a response. Our shared wildlife deserves protection. Technology serves its purpose when it helps people fulfil these responsibilities.
          </p>
          <p>
            From the fields where I once herded cattle to the grazing lands and game parks of Africa, my hope is that Mufudzi will help people act with greater knowledge, protect livelihoods and care more effectively for animal life.
          </p>
          <p>
            To every farmer, herder, conservationist and partner: welcome. Thank you for joining a mission rooted in lived experience, guided by faith and committed to Africa’s future.
          </p>
          <p>
            Welcome to Mufudzi. Together, let us look well to our herds, safeguard our wildlife and build prosperity for generations to come.
          </p>
        </div>

        <footer className="clear-both mt-10">
          <p className="text-[17px] text-ink">Yours sincerely,</p>
          <p className="mt-3 text-[17px] font-semibold text-ink">Munyaradzi Matindike</p>
          <img src="/images/ceo-signature.png" alt="Signature of Munyaradzi Matindike" className="mt-3 h-16 w-auto" />
          <p className="mt-2 text-[15px] text-grey">Founder &amp; CEO, Mufudzi</p>
        </footer>
      </article>
    </div>
  );
}
