"use client";

import { FormEvent, useRef, useState } from "react";
import { getTerminalCommands } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

type Line = { text: string; kind: "cmd" | "out" | "err" };

export default function Terminal() {
  const { t, lang } = useLanguage();
  const terminalCommands = getTerminalCommands(lang);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  const run = (e: FormEvent) => {
    e.preventDefault();
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setLines([]);
      setValue("");
      return;
    }

    const next: Line[] = [...lines, { text: `> ${cmd}`, kind: "cmd" }];
    if (terminalCommands[cmd]) {
      next.push({ text: terminalCommands[cmd], kind: "out" });
    } else {
      next.push({ text: `Command not found: ${cmd}. Type 'help'.`, kind: "err" });
    }
    setLines(next);
    setValue("");
    requestAnimationFrame(() => {
      outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
    });
  };

  return (
    <section
      id="terminal"
      className="relative border-t border-ink/15 bg-bg px-6 py-24 md:px-12"
    >
      <span className="font-mono text-xs tracking-widest2 text-dim">
        {t("terminal", "tag")}
      </span>
      <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        {t("terminal", "title")}
      </h2>

      <div className="mx-auto mt-10 max-w-2xl border border-ink/20 bg-black/40">
        <div
          ref={outputRef}
          className="h-64 overflow-y-auto p-5 font-mono text-xs leading-relaxed"
        >
          <p className="text-dim">{t("terminal", "hint")}</p>
          {lines.map((l, i) => (
            <p
              key={i}
              className={
                l.kind === "cmd"
                  ? "text-ink"
                  : l.kind === "err"
                  ? "text-red-400/80"
                  : "whitespace-pre-wrap text-dim"
              }
            >
              {l.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={run}
          className="flex items-center gap-3 border-t border-ink/15 px-5 py-3"
        >
          <span className="font-mono text-xs text-dim">vishal@sec:~$</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-xs text-ink outline-none"
          />
        </form>
      </div>
    </section>
  );
}
