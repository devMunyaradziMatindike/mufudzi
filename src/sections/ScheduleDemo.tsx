import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CONTACT } from "../data/content";

const ANIMALS = ["Sheep", "Goats", "Cattle", "Horses", "Pets", "Pigs", "Combination"] as const;
const PLACES = [
  "Banket",
  "Beitbridge",
  "Bindura",
  "Binga",
  "Birchenough Bridge",
  "Bulawayo",
  "Centenary",
  "Chegutu",
  "Chimanimani",
  "Chinhoyi",
  "Chipinge",
  "Chiredzi",
  "Chirundu",
  "Chitungwiza",
  "Chivhu",
  "Concession",
  "Epworth",
  "Esigodini",
  "Figtree",
  "Filabusi",
  "Glendale",
  "Gokwe",
  "Guruve",
  "Gutu",
  "Gwanda",
  "Gweru",
  "Harare",
  "Hwange",
  "Kadoma",
  "Kariba",
  "Karoi",
  "Kezi",
  "Kotwa",
  "Kwekwe",
  "Lupane",
  "Macheke",
  "Marondera",
  "Mashava",
  "Masvingo",
  "Mazowe",
  "Mount Darwin",
  "Murehwa",
  "Mutare",
  "Mutoko",
  "Mvuma",
  "Mvurwi",
  "Norton",
  "Nyanga",
  "Plumtree",
  "Raffingora",
  "Redcliff",
  "Rusape",
  "Ruwa",
  "Shamva",
  "Shurugwi",
  "Triangle",
  "Victoria Falls",
  "Zvishavane",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Day = { year: number; month: number; day: number };

export function useDemoScreen() {
  const [open, setOpen] = useState(() => window.location.hash === "#demo");
  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#demo");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return open;
}

export function ScheduleDemo() {
  const today = useMemo(() => harareToday(), []);
  const [cursor, setCursor] = useState<Day>({ year: today.year, month: today.month, day: 1 });
  const [selected, setSelected] = useState<Day | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState("");
  const [location, setLocation] = useState("");
  const [placeOpen, setPlaceOpen] = useState(false);
  const [placeActive, setPlaceActive] = useState(0);

  const places = useMemo(() => {
    const q = location.trim().toLowerCase();
    if (!q) return [];
    return PLACES.filter((p) => p.toLowerCase().includes(q)).slice(0, 8);
  }, [location]);
  const placePicked = places.length === 1 && places[0].toLowerCase() === location.trim().toLowerCase();
  const showPlaces = placeOpen && places.length > 0 && !placePicked;
  const cells = useMemo(() => monthCells(cursor.year, cursor.month), [cursor.year, cursor.month]);
  const slots = selected ? openSlots(selected, today) : [];
  const atCurrentMonth = cursor.year === today.year && cursor.month === today.month;
  const ready = Boolean(selected && time && name.trim() && animal && location.trim());
  const whatsapp = ready && selected && time ? demoUrl(name, animal, location, selected, time) : "";

  const pickDay = (day: number) => {
    const next = { year: cursor.year, month: cursor.month, day };
    if (openSlots(next, today).length === 0) return;
    setSelected(next);
    setTime(null);
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-40 overflow-auto bg-surface">
      <div className="mx-auto max-w-[1080px] px-4 pb-16 pt-28 sm:px-6">
        <div className="card grid shadow-[0_24px_60px_-36px_rgba(31,38,26,0.45)] lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          <div className="p-6 sm:p-8 lg:pr-6">
            <div className="eyebrow">Live demo</div>
            <h1 className="mt-3 text-[clamp(28px,3vw,40px)] font-bold leading-[1.05] tracking-tight text-ink">
              Schedule a live demo.
            </h1>
            <ul className="mt-8 space-y-4 text-sm text-ink">
              <li className="flex items-start gap-3">
                <FactIcon>
                  <circle cx="12" cy="12" r="7" />
                  <path d="M12 8.5V12l2.2 1.6" />
                </FactIcon>
                <span>
                  <span className="block font-semibold">1 hour</span>
                  <span className="text-grey">Each demo</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FactIcon>
                  <rect x="5" y="6" width="14" height="13" rx="2" />
                  <path d="M8 4.5V7.5M16 4.5V7.5M5 10h14" />
                </FactIcon>
                <span>
                  <span className="block font-semibold">Weekdays</span>
                  <span className="text-grey">13:00 and 14:00</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FactIcon>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 5.2v1.6M12 17.2v1.6M5.2 12h1.6M17.2 12h1.6M7.2 7.2l1.1 1.1M15.7 15.7l1.1 1.1M16.8 7.2l-1.1 1.1M8.3 15.7l-1.1 1.1" />
                </FactIcon>
                <span>
                  <span className="block font-semibold">Saturday</span>
                  <span className="text-grey">09:00–18:00</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FactIcon>
                  <path d="M12 20s5-4.4 5-8.2A5 5 0 0 0 7 11.8C7 15.6 12 20 12 20z" />
                  <circle cx="12" cy="11.5" r="1.6" />
                </FactIcon>
                <span>
                  <span className="block font-semibold">Harare time</span>
                  <span className="text-grey">CAT (UTC+2)</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="border-t border-line p-6 sm:p-8 lg:border-x lg:border-t-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">
                {MONTHS[cursor.month]} {cursor.year}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-green disabled:opacity-30"
                  aria-label="Previous month"
                  disabled={atCurrentMonth}
                  onClick={() => setCursor(shiftMonth(cursor, -1))}
                >
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-green"
                  aria-label="Next month"
                  onClick={() => setCursor(shiftMonth(cursor, 1))}
                >
                  <Chevron dir="right" />
                </button>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wide text-grey-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="pb-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center" aria-label="Choose a date">
              {cells.map((day, i) => {
                if (day == null) return <div key={`e-${i}`} className="h-11" />;
                const date = { year: cursor.year, month: cursor.month, day };
                const open = openSlots(date, today).length > 0;
                const isSelected = selected?.year === date.year && selected.month === date.month && selected.day === day;
                const isToday = date.year === today.year && date.month === today.month && day === today.day;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!open}
                    aria-pressed={isSelected}
                    aria-label={longDate(date)}
                    onClick={() => pickDay(day)}
                    className={`mx-auto grid h-11 w-11 place-items-center rounded-full text-sm font-semibold transition ${
                      isSelected
                        ? "bg-green text-white shadow-[0_8px_18px_-8px_rgba(130,183,24,0.9)]"
                        : open
                          ? `text-ink hover:bg-green-soft ${isToday ? "ring-1 ring-green" : ""}`
                          : "cursor-default text-grey-2/70"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-line p-6 sm:p-8 lg:border-t-0 lg:pl-6">
            <h2 className="text-lg font-bold leading-snug text-ink">{selected ? longDate(selected) : "Select a date"}</h2>
            {!selected && <p className="mt-2 text-sm text-grey">Open days show the times you can book.</p>}
            {selected && (
              <ul className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
                {slots.map((slot) => (
                  <li key={slot}>
                    <button
                      type="button"
                      aria-pressed={time === slot}
                      onClick={() => setTime(slot)}
                      className={`w-full rounded-full border px-3 py-2.5 text-sm font-semibold transition ${
                        time === slot
                          ? "border-green bg-green text-white shadow-[0_8px_18px_-8px_rgba(130,183,24,0.9)]"
                          : "border-line bg-white text-ink hover:border-green hover:bg-green-soft"
                      }`}
                    >
                      {slot}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {selected && time && (
              <form
                className="mt-5 space-y-5 rounded-2xl border border-line bg-white p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ready) window.open(whatsapp, "_blank", "noopener,noreferrer");
                }}
              >
                <p className="text-sm font-semibold leading-snug text-ink">
                  {longDate(selected)}
                  <span className="mt-0.5 block font-medium text-grey">{time} · Harare time</span>
                </p>
                <label className="block">
                  <span className="text-sm font-bold uppercase tracking-wider text-grey">Name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="demo-field mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] font-medium outline-none transition focus:border-green focus:bg-white focus:ring-2 focus:ring-green/20"
                    autoComplete="name"
                  />
                </label>
                <fieldset>
                  <legend className="text-sm font-bold uppercase tracking-wider text-grey">What do you want to track?</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ANIMALS.map((a) => {
                      const selectedAnimal = animal === a;
                      return (
                        <button
                          key={a}
                          type="button"
                          aria-pressed={selectedAnimal}
                          onClick={() => setAnimal(a)}
                          className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                            selectedAnimal
                              ? "border-green bg-green text-white shadow-[0_8px_18px_-8px_rgba(130,183,24,0.9)]"
                              : "border-line bg-surface text-ink hover:border-green hover:bg-green-soft"
                          }`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <label className="relative block">
                  <span className="text-sm font-bold uppercase tracking-wider text-grey">Location</span>
                  <input
                    required
                    value={location}
                    role="combobox"
                    aria-expanded={showPlaces}
                    aria-controls="demo-places"
                    aria-autocomplete="list"
                    aria-activedescendant={showPlaces ? `demo-place-${placeActive}` : undefined}
                    placeholder="Start typing a place in Zimbabwe"
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setPlaceOpen(true);
                      setPlaceActive(0);
                    }}
                    onFocus={() => setPlaceOpen(true)}
                    onBlur={() => setPlaceOpen(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setPlaceOpen(false);
                      if (!showPlaces) return;
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setPlaceActive((i) => Math.min(i + 1, places.length - 1));
                      }
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setPlaceActive((i) => Math.max(i - 1, 0));
                      }
                      if (e.key === "Enter" && places[placeActive]) {
                        e.preventDefault();
                        setLocation(places[placeActive]);
                        setPlaceOpen(false);
                      }
                    }}
                    className="demo-field mt-2 w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] font-medium outline-none transition focus:border-green focus:bg-white focus:ring-2 focus:ring-green/20"
                    autoComplete="off"
                  />
                  {showPlaces && (
                    <ul id="demo-places" role="listbox" className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-2xl border border-line bg-white shadow-[0_16px_40px_-24px_rgba(31,38,26,0.45)]">
                      {places.map((place, i) => (
                        <li key={place} role="presentation">
                          <button
                            id={`demo-place-${i}`}
                            type="button"
                            role="option"
                            aria-selected={i === placeActive}
                            className={`block w-full px-4 py-2.5 text-left text-sm font-medium ${i === placeActive ? "bg-green-soft text-ink" : "text-ink hover:bg-surface"}`}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => setPlaceActive(i)}
                            onClick={() => {
                              setLocation(place);
                              setPlaceOpen(false);
                            }}
                          >
                            {place}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </label>
                {ready ? (
                  <p className="text-sm text-green-dark">Ready to send on WhatsApp.</p>
                ) : (
                  <p className="text-sm text-grey">Add your name, what you track, and a location to continue.</p>
                )}
                <a
                  href={ready ? whatsapp : undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!ready}
                  className={`btn btn-green w-full justify-center ${ready ? "" : "pointer-events-none opacity-40"}`}
                  onClick={(e) => {
                    if (!ready) e.preventDefault();
                  }}
                >
                  Submit
                </a>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactIcon({ children }: { children: ReactNode }) {
  return (
    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-soft text-green-dark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d={dir === "left" ? "M14.5 6.5 9 12l5.5 5.5" : "M9.5 6.5 15 12l-5.5 5.5"} />
    </svg>
  );
}

function harareToday(): Day & { minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Harare",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const num = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  let hour = num("hour");
  if (hour === 24) hour = 0;
  return { year: num("year"), month: num("month") - 1, day: num("day"), minutes: hour * 60 + num("minute") };
}

function weekday(date: Day) {
  return new Date(date.year, date.month, date.day).getDay();
}

function slotsFor(date: Day) {
  const day = weekday(date);
  if (day === 0) return [];
  if (day === 6) return Array.from({ length: 10 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);
  return ["13:00", "14:00"];
}

function openSlots(date: Day, today: Day & { minutes: number }) {
  if (date.year < today.year) return [];
  if (date.year === today.year && date.month < today.month) return [];
  if (date.year === today.year && date.month === today.month && date.day < today.day) return [];
  const slots = slotsFor(date);
  if (date.year === today.year && date.month === today.month && date.day === today.day) {
    return slots.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > today.minutes;
    });
  }
  return slots;
}

function monthCells(year: number, month: number) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return cells;
}

function shiftMonth(date: Day, delta: number): Day {
  const next = new Date(date.year, date.month + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth(), day: 1 };
}

function longDate(date: Day) {
  return `${WEEKDAYS[weekday(date)]}, ${date.day} ${MONTHS[date.month]} ${date.year}`;
}

function demoUrl(name: string, animal: string, location: string, date: Day, time: string) {
  const text = [
    "Live demo request",
    `Name: ${name.trim()}`,
    `Track: ${animal}`,
    `Location: ${location.trim()}`,
    `Date: ${longDate(date)}`,
    `Time: ${time} (Harare, CAT)`,
  ].join("\n");
  return `${CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`;
}
