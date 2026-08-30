"use client";

import { L, tools } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function Tools() {
  const { t, lang } = useLanguage();
  return (
    <section
      id="tools"
      className="relative border-t border-ink/15 bg-bg px-6 py-24 md:px-12"
    >
      <span className="font-mono text-xs tracking-widest2 text-dim">
        {t("tools", "tag")}
      </span>
      <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
        {t("tools", "title")}
      </h2>

      <div className="mt-12 grid grid-cols-2 gap-px bg-ink/15 sm:grid-cols-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="group flex flex-col justify-between gap-6 bg-bg p-5 transition-colors hover:bg-ink/5"
          >
            <span className="font-display text-base text-ink">{tool.name}</span>
            <span className="font-mono text-[10px] tracking-widest2 text-dim">
              {L(tool.cat, lang).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
