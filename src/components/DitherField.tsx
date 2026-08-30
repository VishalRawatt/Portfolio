"use client";

import { PointerEventHandler, useEffect, useRef } from "react";
import {
  DitherConfig,
  getResponsiveConfig,
  resolveDitherConfig,
} from "@/lib/ditherConfig";
import { DitherRenderer } from "./DitherShader";

interface DitherFieldProps {
  config?: Partial<DitherConfig>;
  className?: string;
}

/**
 * Same GPU dot/bayer pipeline as <DitherVideo />, but with no video
 * source at all — luminance comes from a seeded, drifting fbm noise
 * field instead. Gives every non-hero section its own distinct look
 * (via seed/color/algorithm/flowDirection) without reusing footage.
 */
export default function DitherField({
  config,
  className = "",
}: DitherFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<DitherRenderer | null>(null);
  const baseConfig = resolveDitherConfig({ sourceMode: "generative", ...config });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: DitherRenderer | null = null;
    try {
      renderer = new DitherRenderer(
        canvas,
        null,
        getResponsiveConfig(baseConfig, window.innerWidth)
      );
      rendererRef.current = renderer;
      renderer.start();
    } catch (e) {
      console.warn("Dither field failed to init:", e);
    }

    return () => {
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResize = () => {
      const r = rendererRef.current;
      if (!r) return;
      r.setConfig(getResponsiveConfig(baseConfig, window.innerWidth));
      r.resize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [baseConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onVis = () => {
      const r = rendererRef.current;
      if (!r) return;
      document.hidden ? r.stop() : r.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    const el = canvasRef.current;
    const r = rendererRef.current;
    if (!el || !r) return;
    const rect = el.getBoundingClientRect();
    r.setMouse(
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height
    );
  };
  const handlePointerLeave = () => rendererRef.current?.clearMouse();

  return (
    <div
      className={`relative overflow-hidden bg-bg ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
