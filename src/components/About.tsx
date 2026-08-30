"use client";

import DitherImage from "./DitherImage";
import { L, about, certifications, media } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function About() {
  const { t, lang } = useLanguage();
  return (
    <>
      <section
        id="about"
        className="relative grid grid-cols-1 gap-10 border-t border-ink/15 bg-bg px-6 py-24 md:grid-cols-12 md:px-12"
      >
        <div className="md:col-span-5">
          <span className="font-mono text-xs tracking-widest2 text-dim">
            {t("about", "tag")}
          </span>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {L(about.whoami, lang)}
          </h2>
          <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-dim">
            {t("about", "bio")}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {about.focus.map((f) => (
              <span
                key={f}
                className="border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-widest2 text-dim"
              >
                {f.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <DitherImage
            config={{
              imageSrc: media.aboutPhoto,
              dotSize: 6,
              algorithm: "halftone",
            }}
            className="aspect-video w-full"
          />
        </div>
      </section>

      <section
        id="certifications"
        className="relative border-t border-ink/15 bg-bg px-6 py-24 md:px-12"
      >
        <span className="font-mono text-xs tracking-widest2 text-dim">
          {t("certifications", "tag")}
        </span>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
          {t("certifications", "title")}
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between gap-4 border-t border-ink/15 py-3 font-mono text-sm text-ink/85"
            >
              <span>{c.name}</span>
              <span
                className={`shrink-0 text-[10px] tracking-widest2 ${
                  c.status === "CERTIFIED" ? "text-ink/60" : "text-amber-400/70"
                }`}
              >
                ● {lang === "de" ? (c.status === "CERTIFIED" ? "ZERTIFIZIERT" : "IN ARBEIT") : c.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
