"use client";

import { useEffect, useRef, useState } from "react";
import DitherImage from "./DitherImage";
import { L, type Project } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.15, rootMargin: "200px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 gap-6 border-t border-ink/15 py-10 transition-all duration-700 md:grid-cols-12 md:gap-8 md:py-16 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="md:col-span-5 md:order-2">
        <DitherImage
          config={{ imageSrc: project.image, dotSize: 5, algorithm: project.algorithm }}
          className="aspect-[4/3] w-full"
        />
      </div>
      <div className="flex flex-col justify-center md:col-span-7 md:order-1">
        <span className="font-mono text-xs tracking-widest2 text-dim">
          {String(index + 1).padStart(2, "0")} — {L(project.category, lang).toUpperCase()}
        </span>
        <h3 className="mt-3 font-display text-3xl text-ink md:text-4xl">
          {L(project.title, lang)}
        </h3>
        <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-dim">
          {L(project.description, lang)}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-widest2 text-dim"
            >
              {tag.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
