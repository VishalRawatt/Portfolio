"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

const NAV_KEYS: Record<string, "work" | "about" | "certifications" | "contact"> = {
  "#work": "work",
  "#about": "about",
  "#certifications": "certifications",
  "#contact": "contact",
};

export default function Navigation() {
  const { t, lang, toggle } = useLanguage();
  const [active, setActive] = useState<string>("#hero");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-ink/10 bg-bg/70 px-6 py-5 backdrop-blur-md md:px-12 md:py-6">
      <a href="#hero" className="relative font-display text-sm tracking-widest2 text-ink">
        {site.name.toUpperCase()}
        <span className="mx-0.5 text-[#c81e1e]">.</span>
      </a>

      <nav className="flex items-center gap-5 md:gap-10">
        {site.nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group relative hidden font-mono text-xs tracking-widest2 text-ink sm:inline"
          >
            {t("nav", NAV_KEYS[item.href])}
            <span
              className={`absolute -bottom-1 left-0 h-px bg-ink transition-all duration-300 ${
                active === item.href ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </a>
        ))}

        <button
          onClick={toggle}
          aria-label="Toggle language"
          className="flex items-center gap-1 font-mono text-xs tracking-widest2 text-ink"
        >
          <span className={lang === "de" ? "opacity-100" : "opacity-40"}>DE</span>
          <span className="opacity-40">/</span>
          <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
        </button>
      </nav>
    </header>
  );
}
