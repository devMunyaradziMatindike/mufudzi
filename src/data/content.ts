export const CONTACT = {
  phone: "+263 77 498 4359",
  phoneIntl: "+263774984359",
  whatsapp: "+263 77 498 4359",
  whatsappIntl: "263774984359",
  whatsappUrl: "https://wa.me/263774984359",
  email: "info@nessosystems.co.zw",
  play: "https://play.google.com/store/apps/details?id=com.musikawedu.mobile",
  appStore: "https://apps.apple.com/zw/app/tracesky/id6771047295",
  apk: "/Mufudzi%20Tracking%20App.apk",
};

export const PRICING = {
  tracker: 140,
  license: 8,
  freeMonths: 4,
};

export const VISION = {
  eyebrow: "Vision 2045",
  title: "399M cattle. 534M goats. 439M sheep. And the wildlife in Africa’s game parks.",
  lead: "By 2045, track Africa’s domestic herds and the animals living in its game parks.",
  paragraphs: [
    "Mufudzi’s vision is to be the digital shepherd for Africa. About 1.38 billion cattle, goats, sheep and horses live on the continent — roughly 399 million cattle, 534 million goats, 439 million sheep and 7.7 million horses. By 2045 we aim to have those herds digitized and tracked.",
    "The same goal covers wildlife in Africa’s game parks. There is no single census for every animal in those parks, so that work is the tracking mission itself: know where the herds and the park wildlife are, and keep them secured.",
  ],
  points: [
    "Domestic animals: cattle, sheep, goats and horses across Africa",
    "Wildlife in game parks, tracked alongside the herds",
  ],
};

const oneDecimal = (n: number) => n.toFixed(1);
const round = (n: number) => `${Math.round(n)}`;

export const STATS = [
  { value: 399, suffix: "M", label: "Cattle · Africa", format: round },
  { value: 534, suffix: "M", label: "Goats · Africa", format: round },
  { value: 439, suffix: "M", label: "Sheep · Africa", format: round },
  { value: 7.7, suffix: "M", label: "Horses · Africa", format: oneDecimal },
];

export const PHOTOS = [
  {
    src: "/images/mufudzi-device.jpg",
    alt: "Mufudzi ear-tag GPS tracker front with solar panel",
    title: "The tracker",
    text: "Mufudzi ear-tag locator with solar panel and secure attachment loop.",
  },
  {
    src: "/images/mufudzi-front-back.jpg",
    alt: "Mufudzi tracker front with solar panel and back with charging contacts",
    title: "Front and back",
    text: "Solar face on the front and magnetic charging contacts on the back.",
  },
  {
    src: "/images/mufudzi-on-ear.jpg",
    alt: "Mufudzi ear-tag GPS tracker fitted on a cattle ear",
    title: "On the animal",
    text: "Fitted on the ear for everyday livestock tracking.",
  },
];

export const WHY = [
  {
    title: "No SIM card",
    text: "No SIM card and no mobile data. The tag does not need a phone plan.",
  },
  {
    title: "No Wi-Fi or cellular",
    text: "No Wi-Fi and no cellular network. It works without either one.",
  },
  {
    title: "Solar charging",
    text: "The tag charges from the sun.",
  },
  {
    title: "30 g",
    text: "Light enough for everyday wear on cattle, sheep, goats and horses.",
  },
];

export const ANIMALS = ["Cattle", "Sheep", "Goats", "Horses"];
