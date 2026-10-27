import { jsPDF } from "jspdf";
import { PRICING } from "../data/content";

const ISSUER = {
  name: "Mufudzi",
  lines: ["Farm 42, Coburn Estate", "Chegutu, Zimbabwe"],
  phone: "+263774984359",
  email: "mmatindike@outlook.com",
};

const PRODUCT = "Mufudzi Ear Tag GPS Tracker";

const GREEN = [106, 154, 18] as const;
const INK = [31, 38, 26] as const;
const GREY = [86, 86, 86] as const;
const SURFACE = [244, 246, 240] as const;

export const QUOTE_CURRENCIES = [
  { code: "USD", label: "US dollar" },
  { code: "ZWG", label: "Zimbabwe Gold" },
  { code: "ZAR", label: "South African rand" },
  { code: "BWP", label: "Botswana pula" },
  { code: "ZMW", label: "Zambian kwacha" },
  { code: "MWK", label: "Malawi kwacha" },
  { code: "LSL", label: "Lesotho loti" },
  { code: "MZN", label: "Mozambican metical" },
] as const;

export type QuoteCurrency = (typeof QUOTE_CURRENCIES)[number]["code"];

export const ZWG_PER_USD = 40;

export type DocumentKind = "quote" | "invoice";

export type QuoteDetails = {
  name: string;
  address: string;
  trackers: number;
  currency: QuoteCurrency;
  rate: number;
  kind?: DocumentKind;
  issued?: Date;
};

export function quoteFileName(name: string, kind: DocumentKind = "quote") {
  const safe = name.trim().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || (kind === "invoice" ? "Invoice" : "Quote");
  return kind === "invoice" ? `Mufudzi-Invoice-${safe}.pdf` : `Mufudzi-Quote-${safe}.pdf`;
}

export function money(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function fetchUsdRates(): Promise<Record<string, number> | null> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) return null;
    const body = (await response.json()) as { result?: string; rates?: Record<string, number> };
    if (body.result !== "success" || !body.rates) return null;
    return body.rates;
  } catch {
    return null;
  }
}

export function rateFor(currency: QuoteCurrency, rates: Record<string, number> | null) {
  if (currency === "USD") return 1;
  if (currency === "ZWG") return ZWG_PER_USD;
  const rate = rates?.[currency];
  return typeof rate === "number" && Number.isFinite(rate) && rate > 0 ? rate : null;
}

function stamp(date: Date, kind: DocumentKind) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const prefix = kind === "invoice" ? "I" : "Q";
  return `${prefix}-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const BANKING_DETAILS = [
  "CABS ACCOUNT DETAILS",
  "ACCOUNT NAME : MUNYARADZI T MATINDIKE",
  "NOSTRO CABS FCA : 1153211432",
  "ZWG CABS : 1153211440",
  "BRANCH : CHISIPITE",
  "SWIFT CODE : CABSZWHA",
  "",
  "Other Banking details",
  "EcoCash : 0774 984 359",
  "Innbucks : 0774984359",
  "WorldRemit, Mukuru, Mama Money, Western Union, etc available",
];

const MOTTO = "Your digital shepherd";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const size = 0x8000;
  for (let index = 0; index < bytes.length; index += size) {
    binary += String.fromCharCode(...bytes.subarray(index, index + size));
  }
  return btoa(binary);
}

async function loadBase64(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return bytesToBase64(new Uint8Array(await response.arrayBuffer()));
}

function trimPartner(base64: string, aspect?: number): Promise<{ dataUrl: string; aspect: number }> {
  const dataUrl = `data:image/png;base64,${base64}`;
  if (aspect || typeof document === "undefined") {
    return Promise.resolve({ dataUrl, aspect: aspect ?? 1 });
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ dataUrl, aspect: img.naturalWidth / img.naturalHeight });
        return;
      }
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 20 && (data[index] < 245 || data[index + 1] < 245 || data[index + 2] < 245)) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < minX) {
        resolve({ dataUrl, aspect: width / height });
        return;
      }
      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;
      const out = document.createElement("canvas");
      out.width = cropW;
      out.height = cropH;
      out.getContext("2d")?.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      resolve({ dataUrl: out.toDataURL("image/png"), aspect: cropW / cropH });
    };
    img.onerror = () => reject(new Error("Could not read the Musikawedu logo"));
    img.src = dataUrl;
  });
}

export async function buildQuote(
  details: QuoteDetails,
  assets?: { font: string; logo: string; partner: string; partnerAspect?: number; teachers?: string; teachersBold?: string },
) {
  const issued = details.issued ?? new Date();
  const kind = details.kind ?? "quote";
  const qty = details.trackers;
  const currency = details.currency;
  const rate = details.rate;
  const unit = PRICING.tracker * rate;
  const total = qty * unit;
  const netCents = Math.round(total * 100);
  const vatCents = kind === "invoice" ? Math.round((netCents * 155) / 1000) : 0;
  const grossCents = netCents + vatCents;
  const gross = grossCents / 100;
  const vat = vatCents / 100;
  const net = netCents / 100;
  const license = PRICING.license * rate;
  const price = (amount: number) => money(amount, currency);
  const [font, logo, partner] = assets
    ? [assets.font, assets.logo, assets.partner]
    : await Promise.all([
        loadBase64("/fonts/HomemadeApple-Regular.ttf"),
        loadBase64("/images/quote-logo.png"),
        loadBase64("/images/musikawedu-logo.png"),
      ]);
  const [teachers, teachersBold] = assets?.teachers && assets.teachersBold
    ? [assets.teachers, assets.teachersBold]
    : await Promise.all([loadBase64("/fonts/Teachers-Regular.ttf"), loadBase64("/fonts/Teachers-Bold.ttf")]);
  const partnerMark = await trimPartner(partner, assets?.partnerAspect);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS("HomemadeApple-Regular.ttf", font);
  doc.addFont("HomemadeApple-Regular.ttf", "HomemadeApple", "normal");
  doc.addFileToVFS("Teachers-Regular.ttf", teachers);
  doc.addFont("Teachers-Regular.ttf", "Teachers", "normal");
  doc.addFileToVFS("Teachers-Bold.ttf", teachersBold);
  doc.addFont("Teachers-Bold.ttf", "Teachers", "bold");

  const pageWidth = doc.internal.pageSize.getWidth();
  const left = 16;
  const right = pageWidth - 16;
  const width = right - left;

  const logoSize = 24;
  doc.addImage(`data:image/png;base64,${logo}`, "PNG", left, 14, logoSize, logoSize);
  doc.setFont("HomemadeApple", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GREEN);
  doc.text(MOTTO, left, 44);

  doc.setFont("Teachers", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...GREEN);
  doc.text(kind === "invoice" ? "FISCAL TAX INVOICE" : "QUOTATION", pageWidth / 2, 52, { align: "center" });

  const dateLabel = issued.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const validUntil = addDays(issued, 7).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const meta: [string, string][] = [
    ["NUMBER", stamp(issued, kind)],
    ["DATE", dateLabel],
    ...(kind === "invoice" ? [["VALID UNTIL", validUntil] as [string, string]] : []),
  ];
  let metaY = 20;
  meta.forEach(([label, value]) => {
    doc.setFont("Teachers", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GREEN);
    doc.text(label, 118, metaY);
    doc.setFont("Teachers", "normal");
    doc.setTextColor(...INK);
    doc.text(value, 140, metaY);
    metaY += 6;
  });

  const partyY = 62;
  doc.setFont("Teachers", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...GREEN);
  doc.text("FROM", left, partyY);
  doc.text("TO", right, partyY, { align: "right" });

  doc.setFont("Teachers", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  const issuerLines = [ISSUER.name, ...ISSUER.lines, ISSUER.phone, ISSUER.email];
  issuerLines.forEach((line, index) => doc.text(line, left, partyY + 6 + index * 5));

  const addressLines = doc.splitTextToSize(details.address.trim(), 78) as string[];
  let toY = partyY + 6;
  doc.text(details.name.trim(), right, toY, { align: "right" });
  toY += 5;
  doc.setTextColor(...GREY);
  addressLines.forEach((line) => {
    doc.text(line, right, toY, { align: "right" });
    toY += 4.5;
  });

  let y = Math.max(partyY + 6 + issuerLines.length * 5, toY) + 10;

  const totalLabel = price(total);
  const unitLabel = price(unit);
  doc.setFont("Teachers", "normal");
  doc.setFontSize(10);
  const totalX = right - 4;
  const priceX = totalX - doc.getTextWidth(totalLabel) - 5;
  const qtyX = priceX - doc.getTextWidth(unitLabel) - 5;

  doc.setFillColor(...GREEN);
  doc.roundedRect(left, y, width, 12, 2, 2, "F");
  doc.setFont("Teachers", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM DESCRIPTION", left + 4, y + 7.6);
  doc.text("QTY", qtyX, y + 7.6, { align: "right" });
  doc.text("PRICE", priceX, y + 7.6, { align: "right" });
  doc.text("TOTAL", totalX, y + 7.6, { align: "right" });

  y += 16;
  doc.setFillColor(...SURFACE);
  doc.roundedRect(left, y - 4, width, 16, 2, 2, "F");
  doc.setFont("Teachers", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(PRODUCT, left + 4, y + 5);
  doc.text(String(qty), qtyX, y + 5, { align: "right" });
  doc.text(unitLabel, priceX, y + 5, { align: "right" });
  doc.text(totalLabel, totalX, y + 5, { align: "right" });

  y += 22;
  doc.setDrawColor(228, 232, 222);
  doc.setLineWidth(0.3);
  doc.line(118, y, right, y);
  y += 8;
  doc.setFont("Teachers", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(kind === "invoice" ? "EXCL. VAT" : "SUB TOTAL", 118, y);
  doc.text(price(kind === "invoice" ? net : total), right - 4, y, { align: "right" });
  if (kind === "invoice") {
    y += 8;
    doc.setFontSize(10);
    doc.text("VAT 15.5%", 118, y);
    doc.text(price(vat), right - 4, y, { align: "right" });
  }
  y += 8;
  doc.setFontSize(12);
  doc.text("GRAND TOTAL", 118, y);
  doc.text(price(kind === "invoice" ? gross : total), right - 4, y, { align: "right" });
  if (kind === "invoice") {
    y += 8;
    doc.setFontSize(12);
    doc.text("AMOUNT DUE", 118, y);
    doc.text(price(gross), right - 4, y, { align: "right" });
    y += 6;
    doc.setFont("Teachers", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text("Valid for 7 days from the day of receipt.", 118, y);
  }

  y += 12;
  const cardW = (width - 6) / 2;
  doc.setFont("Teachers", "normal");
  doc.setFontSize(8);
  const bankLines =
    kind === "invoice"
      ? BANKING_DETAILS.flatMap((line) => (line ? (doc.splitTextToSize(line, cardW - 12) as string[]) : [""]))
      : [];
  const cardH = kind === "invoice" ? Math.max(48, 16 + bankLines.length * 3.6) : 48;
  doc.setFillColor(...SURFACE);
  doc.roundedRect(left, y, cardW, cardH, 2, 2, "F");
  doc.roundedRect(left + cardW + 6, y, cardW, cardH, 2, 2, "F");

  doc.setFont("Teachers", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...GREEN);
  doc.text("Payable to", left + 5, y + 8);
  doc.setFont("Teachers", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  const payable = [ISSUER.name, ...ISSUER.lines, ISSUER.phone, ISSUER.email];
  payable.forEach((line, index) => doc.text(line, left + 5, y + 16 + index * 5));

  doc.setFont("Teachers", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...GREEN);
  doc.text(kind === "invoice" ? "Banking Details" : "Included", left + cardW + 11, y + 8);
  doc.setFont("Teachers", "normal");
  doc.setTextColor(...INK);
  if (kind === "invoice") {
    doc.setFontSize(8);
    bankLines.forEach((line, index) => {
      if (line === "CABS ACCOUNT DETAILS" || line === "Other Banking details") doc.setFont("Teachers", "bold");
      else doc.setFont("Teachers", "normal");
      doc.text(line, left + cardW + 11, y + 15 + index * 3.6);
    });
  } else {
    doc.setFontSize(10);
    const included = doc.splitTextToSize(
      `The first ${PRICING.freeMonths} months of the license are included with each tracker. The ${price(license)} license starts after that, per tracker each month.`,
      cardW - 12,
    ) as string[];
    included.forEach((line, index) => doc.text(line, left + cardW + 11, y + 16 + index * 5));
  }

  const footerY = 264;
  const footerH = 18;
  doc.setFillColor(...SURFACE);
  doc.roundedRect(left, footerY, width, footerH, 2, 2, "F");
  const markH = 9;
  const markW = markH * partnerMark.aspect;
  const markY = footerY + (footerH - markH) / 2;
  doc.addImage(partnerMark.dataUrl, "PNG", left + 3, markY, markW, markH);
  doc.setFont("Teachers", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  const credit = "a product of musikawedu";
  const creditX = left + 3 + markW + 2.5;
  doc.text(credit, creditX, footerY + 11);
  const footer = `${ISSUER.phone}   ${ISSUER.email}   ${ISSUER.lines.join(", ")}`;
  const detailsX = creditX + doc.getTextWidth(credit) + 3;
  doc.text(footer, detailsX, footerY + 11);

  return doc;
}

export async function downloadQuote(details: QuoteDetails) {
  const doc = await buildQuote(details);
  doc.save(quoteFileName(details.name, details.kind ?? "quote"));
}
