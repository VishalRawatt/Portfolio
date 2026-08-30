"use client";

import { useEffect, useRef, useState } from "react";
import DitherImage from "./DitherImage";
import { L, media, skills } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function Skills() {
  const { t, lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setActive(true),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="skills"
      className="relative grid grid-cols-1 gap-10 border-t border-ink/15 bg-bg px-6 py-24 md:grid-cols-12 md:px-12"
      ref={ref}
    >
      <div className="md:col-span-4">
        <span className="font-mono text-xs tracking-widest2 text-dim">
          {t("skills", "tag")}
        </span>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          {t("skills", "title")}
        </h2>
        <div className="mt-8 hidden aspect-square w-full md:block">
          <DitherImage
            config={{ imageSrc: media.skillsPhoto, dotSize: 5, algorithm: "bayer4" }}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="md:col-span-8">
        {skills.map((s) => (
          <div key={L(s.name, "en")} className="border-t border-ink/15 py-4 first:border-t-0 md:first:border-t">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg text-ink">{L(s.name, lang)}</h3>
              <span className="font-mono text-xs text-dim">{s.pct}%</span>
            </div>
            <div className="mt-3 h-px w-full bg-ink/10">
              <div
                className="h-px bg-ink transition-all duration-[1200ms] ease-out"
                style={{ width: active ? `${s.pct}%` : "0%" }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] tracking-widest2 text-dim">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
