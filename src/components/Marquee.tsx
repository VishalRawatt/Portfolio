import { site } from "@/lib/content";

export default function Marquee() {
  const items = [...site.marquee, ...site.marquee];
  return (
    <div className="relative overflow-hidden border-y border-ink/15 bg-bg py-4">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-mono text-xs tracking-widest2 text-dim"
          >
            {text}
            <span className="text-ink/30">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
