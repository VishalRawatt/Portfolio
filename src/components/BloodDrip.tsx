import type { CSSProperties } from "react";

// Deterministic drop positions/timings (no Math.random — keeps
// server/client render identical and avoids hydration warnings).
// Kept to three, staggered widely, so this reads as a deliberate
// accent rather than a constant drip effect.
const DROPS = [
  { left: "6%", len: 18, delay: 0 },
  { left: "48%", len: 24, delay: 2.4 },
  { left: "88%", len: 16, delay: 4.6 },
];

export default function BloodDrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-0 ${className}`}
      aria-hidden
    >
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="blood-drop"
          style={
            {
              left: d.left,
              "--drip-len": `${d.len}px`,
              "--drip-delay": `${d.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
