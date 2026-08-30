// Central configuration for every dithered surface on the site — both
// <DitherVideo /> (real video source) and <DitherField /> (fully
// generative, no video needed — used so sections don't all reuse the
// same clip). Tweak these values to change the look without touching
// shader or component code.

export type DitherAlgorithm = "bayer4" | "bayer8" | "halftone";
export type DitherSourceMode = "video" | "image" | "generative";

export interface DitherConfig {
  /** "video" samples videoSrc; "generative" renders a seeded noise field
   *  through the same dot pipeline, so non-hero sections stay visually
   *  distinct instead of repeating the same footage. */
  sourceMode: DitherSourceMode;
  /** Path to the video used as the source texture (sourceMode: "video"). */
  videoSrc: string;
  /** Path to the photo used as the source texture (sourceMode: "image"). */
  imageSrc: string;
  /** Size, in source pixels, of one dither cell. Bigger = chunkier dots. */
  dotSize: number;
  /** 0..1 — how strongly the dither pattern clips vs. blends. */
  intensity: number;
  /** Contrast applied to luminance before dithering. */
  contrast: number;
  /** Brightness offset applied to luminance before dithering. */
  brightness: number;
  /** Which ordered-dither / halftone algorithm to use. */
  algorithm: DitherAlgorithm;
  /** RGB (0..1) color of the "on" dots. */
  color: [number, number, number];
  /** RGB (0..1) background color behind the dots. */
  backgroundColor: [number, number, number];
  /** Multiplier on the idle dot "breathing" animation speed. */
  animationSpeed: number;
  /** 0..1 — how strongly the cursor distorts/ripples the field. */
  mouseStrength: number;
  /** Render-resolution multiplier (1 = native, 0.5 = half-res for perf). */
  resolutionScale: number;
  /** Random seed offsetting the noise field (sourceMode: "generative")
   *  so each instance reads as a different pattern. */
  seed: number;
  /** Direction the generative noise field drifts in, unit-ish vector. */
  flowDirection: [number, number];
  /** Speed of the generative flow drift. */
  flowSpeed: number;
}

export const defaultDitherConfig: DitherConfig = {
  sourceMode: "video",
  videoSrc: "/videos/hero.mp4",
  imageSrc: "/images/defender-shield.jpg",
  dotSize: 6,
  intensity: 1,
  contrast: 1.35,
  brightness: 0.02,
  algorithm: "halftone",
  color: [0.95, 0.96, 0.94],
  backgroundColor: [0.02, 0.02, 0.02],
  animationSpeed: 1,
  mouseStrength: 0.55,
  resolutionScale: 1,
  seed: 0,
  flowDirection: [0.3, 1],
  flowSpeed: 0.12,
};

// Per-breakpoint overrides. Applied on top of defaultDitherConfig.
export const responsiveDitherOverrides = {
  tablet: {
    dotSize: 8,
    resolutionScale: 0.75,
    mouseStrength: 0.4,
  } satisfies Partial<DitherConfig>,
  mobile: {
    dotSize: 11,
    resolutionScale: 0.5,
    mouseStrength: 0.25,
    animationSpeed: 0.8,
  } satisfies Partial<DitherConfig>,
};

export function resolveDitherConfig(
  overrides?: Partial<DitherConfig>
): DitherConfig {
  return { ...defaultDitherConfig, ...overrides };
}

export function getResponsiveConfig(
  base: DitherConfig,
  width: number
): DitherConfig {
  if (width < 640) return { ...base, ...responsiveDitherOverrides.mobile };
  if (width < 1024) return { ...base, ...responsiveDitherOverrides.tablet };
  return base;
}
