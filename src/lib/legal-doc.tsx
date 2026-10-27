import type { ReactNode } from "react";

export type LegalBlock =
  | { kind: "title"; text: string }
  | { kind: "meta"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "clause"; label: string; text: string }
  | { kind: "p"; text: string }
  | { kind: "rule" };

export type LegalParseOptions = {
  ruleLines?: string[];
  introHeadings?: string[];
  scheduleSubheads?: string[];
};

export function parseLegalBody(body: string, options: LegalParseOptions = {}): LegalBlock[] {
  const ruleLines = new Set(options.ruleLines ?? ["Mufudzi |"]);
  const introHeadings = new Set(options.introHeadings ?? []);
  const scheduleSubheads = new Set(options.scheduleSubheads ?? []);

  const lines = body
    .split(/\n/)
    .map((line) => line.trimEnd())
    .filter((line, i, all) => !(line === "" && (i === 0 || all[i - 1] === "")));

  const blocks: LegalBlock[] = [];
  let sawTitle = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (!sawTitle) {
      blocks.push({ kind: "title", text: line });
      sawTitle = true;
      continue;
    }

    if (ruleLines.has(line)) {
      blocks.push({ kind: "rule" });
      continue;
    }

    if (/^A product of /i.test(line) || /^Version /i.test(line)) {
      blocks.push({ kind: "meta", text: line });
      continue;
    }

    const section = line.match(/^(\d+)\s+(.+)$/);
    if (section && !/^\d+\.\d+/.test(line)) {
      blocks.push({ kind: "h2", text: `${section[1]}. ${section[2]}` });
      continue;
    }

    const clause = line.match(/^(\d+\.\d+)\s+(.+)$/);
    if (clause) {
      blocks.push({ kind: "clause", label: clause[1], text: clause[2] });
      continue;
    }

    const schedule = line.match(/^(Schedule\s+[A-Z0-9]+)\s+(.+)$/i);
    if (schedule) {
      blocks.push({ kind: "h2", text: `${schedule[1]} — ${schedule[2]}` });
      continue;
    }

    const scheduleItem = line.match(/^(A\d+)\s+(.+)$/);
    if (scheduleItem) {
      blocks.push({ kind: "h3", text: `${scheduleItem[1]}. ${scheduleItem[2]}` });
      continue;
    }

    const letterItem = line.match(/^([A-D])\s+([A-Z].+)$/);
    if (letterItem && !/^A product of /i.test(line)) {
      blocks.push({ kind: "h3", text: `${letterItem[1]}. ${letterItem[2]}` });
      continue;
    }

    if (introHeadings.has(line)) {
      blocks.push({ kind: "h2", text: line });
      continue;
    }

    if (scheduleSubheads.has(line)) {
      blocks.push({ kind: "h3", text: line });
      continue;
    }

    blocks.push({ kind: "p", text: line });
  }

  return blocks;
}

export function renderLegalBlocks(blocks: LegalBlock[]): ReactNode {
  return blocks.map((block, i) => {
    switch (block.kind) {
      case "title":
        return (
          <h1 key={i} className="text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-tight text-ink">
            {block.text}
          </h1>
        );
      case "meta":
        return (
          <p key={i} className="mt-2 text-[15px] text-grey">
            {block.text}
          </p>
        );
      case "h2":
        return (
          <h2 key={i} className="mt-10 text-[22px] font-bold leading-snug tracking-tight text-ink">
            {block.text}
          </h2>
        );
      case "h3":
        return (
          <h3 key={i} className="mt-7 text-[17px] font-bold leading-snug text-ink">
            {block.text}
          </h3>
        );
      case "clause":
        return (
          <p key={i} className="mt-4 text-[15px] leading-relaxed text-ink">
            <span className="font-bold text-green-dark">{block.label}</span> {block.text}
          </p>
        );
      case "rule":
        return <hr key={i} className="my-12 border-line" />;
      case "p":
        return (
          <p key={i} className="mt-3 text-[15px] leading-relaxed text-ink">
            {block.text}
          </p>
        );
    }
  });
}
