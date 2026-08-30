"use client";

import { L, adSurface } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function ADSurface() {
  const { t, lang } = useLanguage();
  return (
    <section
      id="ad-surface"
      className="relative border-t border-ink/15 bg-bg px-6 py-24 md:px-12"
    >
      <span className="font-mono text-xs tracking-widest2 text-dim">
        {t("adSurface", "tag")}
      </span>
      <h2 className="mt-3 max-w-2xl font-display text-4xl text-ink md:text-5xl">
        {t("adSurface", "title")}
      </h2>
      <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-dim">
        {t("adSurface", "desc")}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {adSurface.map((cat) => (
          <div key={L(cat.name, "en")} className="border-t border-ink/15 pt-5">
            <h3 className="font-display text-lg text-ink">{L(cat.name, lang)}</h3>
            <ul className="mt-3 space-y-1.5">
              {cat.items.map((item) => (
                <li key={L(item, "en")} className="font-mono text-xs leading-relaxed text-dim">
                  · {L(item, lang)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
