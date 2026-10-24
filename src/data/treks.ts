/**
 * Trek catalogue.
 *
 * Routes are hand-traced waypoint lists ([lon, lat]) following the real trails.
 * Elevation along each route is sampled from the baked terrain heightmap at
 * runtime (see lib/route.ts), and distance / gain are computed from geometry,
 * so the numbers shown in the UI come from the data, not from copy.
 */

export type LonLat = [number, number];

export interface Scenery {
  /** Position along the route, 0..1 */
  t: number;
  title: string;
  note: string;
}

export interface Trek {
  id: string;
  index: string;
  name: string;
  route: string;
  country: string;
  region: string;
  days: number;
  /** Named high point of the route and its surveyed height in metres. */
  highPoint: { name: string; ele: number };
  difficulty: "Moderate" | "Demanding" | "Strenuous";
  season: string;
  blurb: string;
  long: string;
  accent: string;
  /** Approximate price per person, USD. */
  price: number;
  cardsInStack: number;
  path: LonLat[];
  scenery: Scenery[];
}

export const TREKS: Trek[] = [
  {
    id: "tongariro",
    index: "01",
    name: "Tongariro",
    route: "by the Alpine Crossing",
    country: "New Zealand",
    region: "Central Plateau",
    days: 1,
    highPoint: { name: "Red Crater", ele: 1886 },
    difficulty: "Moderate",
    season: "Nov – Apr",
    blurb: "One long day across a live volcano. Steaming vents, the Emerald Lakes, and Ngauruhoe over your shoulder.",
    long: "The Crossing goes up the Mangatepopo valley, over the saddle into South Crater, up the ridge to Red Crater and then down past the Emerald and Blue Lakes to the Ketetahi side. It is one day, but it is a serious one: exposed, high and weather-driven.",
    accent: "#b8402f",
    price: 240,
    cardsInStack: 3,
    path: [
      [175.5807, -39.1535],
      [175.5955, -39.1497],
      [175.6118, -39.1443],
      [175.6248, -39.1398],
      [175.6347, -39.1372],
      [175.6433, -39.1356],
      [175.6512, -39.1343],
      [175.6563, -39.1322],
      [175.6604, -39.1283],
      [175.6619, -39.1238],
      [175.6594, -39.1174],
      [175.6554, -39.1105],
      [175.6525, -39.1041],
      [175.6486, -39.0961],
      [175.6452, -39.0872],
    ],
    scenery: [
      { t: 0.03, title: "Mangatepopo", note: "Tussock and old lava flows, 1 120 m" },
      { t: 0.3, title: "South Crater", note: "A flat pan under Ngauruhoe's cone" },
      { t: 0.44, title: "Red Crater", note: "Highest point. Sulphur and steam." },
      { t: 0.52, title: "Emerald Lakes", note: "Mineral-green, still warm underfoot" },
      { t: 0.63, title: "Blue Lake", note: "Tapu — sacred — do not touch the water" },
      { t: 0.92, title: "Ketetahi", note: "Beech forest and the car park" },
    ],
  },
  {
    id: "inca",
    index: "02",
    name: "Inca Trail",
    route: "the classic route from KM 82",
    country: "Peru",
    region: "Cusco",
    days: 4,
    highPoint: { name: "Dead Woman's Pass", ele: 4215 },
    difficulty: "Demanding",
    season: "May – Sep",
    blurb: "Four days on Inca stone, over three passes, through cloud forest, arriving at the Sun Gate at first light.",
    long: "From KM 82 beside the Urubamba the trail climbs to Wayllabamba, then steeply to Warmiwañusca — Dead Woman's Pass — at 4 215 m. Two more passes, the ruins at Runkurakay, Sayacmarca and Phuyupatamarca, then the long stone staircase down to Wiñay Wayna and Inti Punku above Machu Picchu.",
    accent: "#c9823a",
    price: 790,
    cardsInStack: 8,
    path: [
      [-72.4617, -13.2265],
      [-72.4640, -13.2498],
      [-72.4833, -13.2639],
      [-72.5000, -13.2600],
      [-72.5113, -13.2578],
      [-72.5202, -13.2461],
      [-72.5282, -13.2418],
      [-72.5355, -13.2378],
      [-72.5425, -13.2255],
      [-72.5497, -13.2110],
      [-72.5420, -13.2010],
      [-72.5355, -13.1936],
      [-72.5347, -13.1686],
      [-72.5450, -13.1631],
    ],
    scenery: [
      { t: 0.02, title: "KM 82", note: "The checkpoint at 2 700 m by the river" },
      { t: 0.17, title: "Wayllabamba", note: "Last village. Camp one." },
      { t: 0.4, title: "Dead Woman's Pass", note: "4 215 m. The hard morning." },
      { t: 0.55, title: "Runkurakay", note: "A round watch-house on the pass" },
      { t: 0.7, title: "Phuyupatamarca", note: "The town above the clouds" },
      { t: 0.95, title: "Inti Punku", note: "Sun Gate. Machu Picchu below." },
    ],
  },
  {
    id: "wtrek",
    index: "03",
    name: "W Trek",
    route: "Torres del Paine, east to west",
    country: "Chile",
    region: "Patagonia",
    days: 5,
    highPoint: { name: "Mirador Base Torres", ele: 870 },
    difficulty: "Demanding",
    season: "Nov – Mar",
    blurb: "Five days in Patagonian wind, drawn as a W between the towers, the French valley and Grey glacier.",
    long: "The W is three valleys joined by lakeshore paths. Up to the base of the towers first, west under the Cuernos to the French valley and the Británico lookout, then on to Paine Grande and north along Lago Grey to the glacier face. Weather does what it wants.",
    accent: "#3c6e8f",
    price: 1150,
    cardsInStack: 9,
    path: [
      // Las Torres → Ascencio valley → Chileno → Base Torres, and back
      [-72.9460, -50.9779],
      [-72.9580, -50.9660],
      [-72.9700, -50.9519],
      [-72.9820, -50.9460],
      [-72.9916, -50.9413],
      [-72.9820, -50.9460],
      [-72.9700, -50.9519],
      [-72.9580, -50.9660],
      [-72.9460, -50.9779],
      // west along the north shore of Lago Nordenskjöld to Los Cuernos
      [-72.9650, -50.9900],
      [-72.9900, -50.9990],
      [-73.0150, -51.0010],
      [-73.0450, -50.9960],
      // Italiano camp → Francés valley → Británico, and back
      [-73.0700, -51.0020],
      [-73.0880, -51.0050],
      [-73.0850, -50.9850],
      [-73.0790, -50.9690],
      [-73.0850, -50.9850],
      [-73.0880, -51.0050],
      // Paine Grande on Lago Pehoé, then north along Lago Grey to the glacier
      [-73.0980, -51.0300],
      [-73.1020, -51.0460],
      [-73.1300, -51.0250],
      [-73.1550, -51.0050],
      [-73.1850, -50.9880],
      [-73.2100, -50.9750],
    ],
    scenery: [
      { t: 0.0, title: "Las Torres", note: "Central sector, 150 m" },
      { t: 0.12, title: "Base Torres", note: "Three granite towers over a green lake" },
      { t: 0.42, title: "Los Cuernos", note: "The horns, black on grey" },
      { t: 0.56, title: "Mirador Británico", note: "The amphitheatre at the valley head" },
      { t: 0.74, title: "Paine Grande", note: "Lago Pehoé. Wind." },
      { t: 0.98, title: "Grey Glacier", note: "The ice face of the Southern Patagonian field" },
    ],
  },
  {
    id: "kilimanjaro",
    index: "04",
    name: "Kilimanjaro",
    route: "by the Machame route",
    country: "Tanzania",
    region: "Kilimanjaro",
    days: 7,
    highPoint: { name: "Uhuru Peak", ele: 5895 },
    difficulty: "Strenuous",
    season: "Jan – Mar · Jun – Oct",
    blurb: "Seven days to the highest point in Africa. Summit night starts at midnight.",
    long: "Machame climbs through rainforest to the Shira plateau, pushes up to Lava Tower at 4 630 m and drops to Barranco to acclimatise, then traverses to Karanga and Barafu. Summit night leaves at midnight for Stella Point and Uhuru Peak at dawn, before the long descent to Mweka.",
    accent: "#e23b2e",
    price: 2400,
    cardsInStack: 15,
    path: [
      [37.2416, -3.1743],
      [37.2570, -3.1500],
      [37.2735, -3.1248],
      [37.2700, -3.1000],
      [37.2649, -3.0778],
      [37.2900, -3.0790],
      [37.3213, -3.0806],
      [37.3301, -3.1046],
      [37.3527, -3.1053],
      [37.3661, -3.0969],
      [37.3609, -3.0725],
      [37.3556, -3.0674],
      [37.3609, -3.0725],
      [37.3661, -3.0969],
      [37.3637, -3.1512],
      [37.3516, -3.2208],
    ],
    scenery: [
      { t: 0.02, title: "Machame Gate", note: "Rainforest, 1 800 m" },
      { t: 0.2, title: "Shira Plateau", note: "Moorland and giant groundsel" },
      { t: 0.33, title: "Lava Tower", note: "4 630 m — climb high, sleep low" },
      { t: 0.42, title: "Barranco Wall", note: "Hands-on scramble, kissing rock" },
      { t: 0.58, title: "Barafu", note: "Summit camp. Sleep early." },
      { t: 0.66, title: "Uhuru Peak", note: "5 895 m. Roof of Africa." },
      { t: 0.95, title: "Mweka Gate", note: "Back into the forest" },
    ],
  },
  {
    id: "ebc",
    index: "05",
    name: "Everest Base Camp",
    route: "up the Khumbu and back",
    country: "Nepal",
    region: "Solukhumbu",
    days: 12,
    highPoint: { name: "Kala Patthar", ele: 5644 },
    difficulty: "Strenuous",
    season: "Mar – May · Oct – Nov",
    blurb: "Twelve days under Everest, up the Khumbu to the foot of the icefall and the view from Kala Patthar.",
    long: "From Lukla the trail follows the Dudh Kosi to Namche Bazaar, then Tengboche monastery, Dingboche and Lobuche, gaining height slowly. Base Camp sits on the glacier at 5 364 m; the view is from Kala Patthar the next morning. Then the same valley, downhill, faster.",
    accent: "#5b7fa6",
    price: 1950,
    cardsInStack: 12,
    path: [
      [86.7314, 27.6877],
      [86.7128, 27.7406],
      [86.7140, 27.8069],
      [86.7400, 27.8250],
      [86.7645, 27.8364],
      [86.8000, 27.8650],
      [86.8315, 27.8923],
      [86.8105, 27.9500],
      [86.8285, 27.9810],
      [86.8528, 28.0024],
      [86.8285, 27.9810],
      [86.8282, 27.9869],
      [86.8285, 27.9810],
      [86.8105, 27.9500],
      [86.8315, 27.8923],
      [86.7645, 27.8364],
      [86.7140, 27.8069],
      [86.7128, 27.7406],
      [86.7314, 27.6877],
    ],
    scenery: [
      { t: 0.0, title: "Lukla", note: "The runway at 2 860 m" },
      { t: 0.12, title: "Namche Bazaar", note: "Sherpa capital. Two nights." },
      { t: 0.22, title: "Tengboche", note: "The monastery under Ama Dablam" },
      { t: 0.37, title: "Lobuche", note: "Memorials on the Thukla pass" },
      { t: 0.5, title: "Base Camp", note: "5 364 m. The icefall creaks." },
      { t: 0.56, title: "Kala Patthar", note: "5 644 m. Everest, full frame." },
      { t: 0.98, title: "Lukla", note: "Home, downhill" },
    ],
  },
];

export const trekById = (id: string) => TREKS.find((t) => t.id === id)!;
