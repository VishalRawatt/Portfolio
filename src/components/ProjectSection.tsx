"use client";

import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProjectSection() {
  const { t } = useLanguage();
  return (
    <section id="work" className="relative bg-bg px-6 py-24 md:px-12">
      <div className="mb-4">
        <span className="font-mono text-xs tracking-widest2 text-dim">
          {t("work", "tag")}
        </span>
        <h2 className="mt-3 font-display text-4xl text-ink md:text-6xl">
          {t("work", "title")}
        </h2>
      </div>

      <div>
        {projects.map((project, i) => (
          <ProjectCard project={project} index={i} key={project.id} />
        ))}
      </div>
    </section>
  );
}
