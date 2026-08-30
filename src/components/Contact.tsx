"use client";

import { contact, site } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  return (
    <section
      id="contact"
      className="relative flex min-h-[70vh] flex-col justify-between border-t border-ink/15 bg-bg px-6 py-24 md:px-12"
    >
      <div>
        <span className="font-mono text-xs tracking-widest2 text-dim">
          {t("contact", "tag")}
        </span>
        <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-ink md:text-6xl">
          {t("contact", "title")}
        </h2>
        <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-dim">
          {t("contact", "message")}
        </p>

        <a
          href={`mailto:${contact.email}`}
          className="mt-10 inline-block border-b border-ink pb-1 font-display text-2xl text-ink transition-opacity hover:opacity-70 md:text-3xl"
        >
          {contact.email}
        </a>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-6">
        <div className="flex flex-wrap gap-6">
          {contact.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs tracking-widest2 text-dim transition-colors hover:text-ink"
            >
              {l.label.toUpperCase()}
            </a>
          ))}
        </div>
        <span className="font-mono text-[10px] tracking-widest2 text-dim">
          © {new Date().getFullYear()} {site.name.toUpperCase()}
        </span>
      </div>
    </section>
  );
}
