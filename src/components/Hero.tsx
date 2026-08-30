"use client";

import { useEffect, useRef, useState } from "react";
import DitherVideo from "./DitherVideo";
import BloodDrip from "./BloodDrip";
import { site, stats } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
}

export default function Hero() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const progress = Math.min(window.scrollY / (el.offsetHeight * 0.9), 1);
      setScale(1 + progress * 0.18);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsVisible(true),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-end overflow-hidden bg-bg"
    >
      <DitherVideo
        className="absolute inset-0 h-full w-full"
        scrollScale={scale}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />

      <div className="relative z-10 w-full px-6 pb-14 md:px-12 md:pb-20">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-[#b3001b]" aria-hidden />
          <p className="font-display text-lg tracking-wide text-ink/90 md:text-2xl">
            {site.tagline}
          </p>
        </div>

        {/* The name itself is the hero title — this is a site about one
            person, not an abstract studio brand. A restrained red glow
            plus an occasional blood-drip animation hangs off the last
            line, kept subtle so it reads as a considered accent. */}
        <h1 className="relative font-display text-[14vw] leading-[0.85] tracking-tight text-ink md:text-[7vw]">
          {site.heroTitleLines.map((line, i) => (
            <span
              key={line}
              className="relative block"
              style={
                i === site.heroTitleLines.length - 1
                  ? { textShadow: "0 0 22px rgba(179,0,27,0.18)" }
                  : undefined
              }
            >
              {line}
              {i === site.heroTitleLines.length - 1 && <BloodDrip />}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-md font-mono text-sm leading-relaxed text-dim md:text-base">
          {t("hero", "description")}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/15 pt-6 md:flex md:gap-16">
          {stats.map((s) => (
            <StatItem key={s.key} stat={s} active={statsVisible} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-center gap-2 md:right-12">
        <span className="font-mono text-[10px] tracking-widest2 text-dim [writing-mode:vertical-lr]">
          {t("hero", "scroll")}
        </span>
        <span className="h-10 w-px animate-pulse bg-ink/40" />
      </div>
    </section>
  );
}

function StatItem({
  stat,
  active,
}: {
  stat: (typeof stats)[number];
  active: boolean;
}) {
  const { t } = useLanguage();
  const value = useCountUp(stat.count, active);
  return (
    <div>
      <div className="font-display text-2xl text-ink md:text-3xl">
        {value.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="font-mono text-[10px] tracking-widest2 text-dim">
        {t("stats", stat.key).toUpperCase()}
      </div>
    </div>
  );
}
