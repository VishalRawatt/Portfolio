"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Lang, dict, t as translate } from "./i18n";

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
  t: <K1 extends keyof typeof dict, K2 extends keyof (typeof dict)[K1]>(
    section: K1,
    key: K2
  ) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language: German. Visitors can switch to English via the
  // toggle in the nav bar.
  const [lang, setLang] = useState<Lang>("de");

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang((l) => (l === "de" ? "en" : "de")),
      t: (section, key) => translate(lang, section, key),
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
