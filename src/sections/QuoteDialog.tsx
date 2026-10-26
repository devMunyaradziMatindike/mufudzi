import { useEffect, useState } from "react";
import { PRICING } from "../data/content";
import { QUOTE_CURRENCIES, type DocumentKind, type QuoteCurrency, downloadQuote, fetchUsdRates, money, rateFor } from "../lib/quote-pdf";

const field =
  "demo-field mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-green focus:ring-2 focus:ring-green/20";

export function QuoteDialog({
  initialTrackers,
  kind,
  onClose,
}: {
  initialTrackers: number;
  kind: DocumentKind;
  onClose: () => void;
}) {
  const [trackers, setTrackers] = useState(String(Math.max(1, initialTrackers || 1)));
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState<QuoteCurrency>("USD");
  const [rates, setRates] = useState<Record<string, number> | null | undefined>(undefined);
  const [step, setStep] = useState<"details" | "download">("details");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchUsdRates().then((next) => {
      if (active) setRates(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const qty = Math.floor(Number(trackers));
  const rate = rateFor(currency, rates ?? null);
  const hardware = rate != null && qty > 0 ? qty * PRICING.tracker * rate : null;
  const ready = Number.isFinite(qty) && qty > 0 && name.trim().length > 0 && address.trim().length > 0 && rate != null;

  const download = async () => {
    if (rate == null) return;
    setSaving(true);
    try {
      await downloadQuote({ name: name.trim(), address: address.trim(), trackers: qty, currency, rate, kind });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[60] overflow-auto bg-ink/40 px-4 py-10" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="card mx-auto w-full max-w-[480px] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="quote-title" className="text-2xl font-bold tracking-tight text-ink">
          {kind === "invoice" ? "Generate invoice" : "Generate quote"}
        </h2>
        {step === "details" ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (ready) setStep("download");
            }}
          >
            <label className="block text-sm font-semibold text-ink">
              How many trackers do you want?
              <input
                required
                inputMode="numeric"
                min={1}
                value={trackers}
                onChange={(e) => setTrackers(e.target.value.replace(/[^\d]/g, ""))}
                className={field}
              />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Name
              <input required value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} className={field} />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Address
              <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className={field} />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Currency
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as QuoteCurrency)}
                className={field}
              >
                {QUOTE_CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} — {item.label}
                  </option>
                ))}
              </select>
            </label>
            {hardware != null ? (
              <p className="text-sm font-semibold text-ink">
                {qty} {qty === 1 ? "tracker" : "trackers"} · {money(hardware, currency)}
              </p>
            ) : (
              <p className="text-sm text-grey">
                {rates === undefined
                  ? "Loading exchange rates…"
                  : "Exchange rates could not be loaded. US dollars and Zimbabwe Gold are still available."}
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="btn btn-green disabled:cursor-not-allowed disabled:opacity-50" disabled={!ready}>
                Submit
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <p className="text-[17px] leading-relaxed text-ink">
              Do you want to download the {kind === "invoice" ? "invoice" : "quote"}?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn-green disabled:cursor-not-allowed disabled:opacity-50" disabled={saving} onClick={download}>
                {saving ? "Preparing…" : "Yes, download"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
