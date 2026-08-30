"use client";

import { PointerEventHandler, useEffect, useRef } from "react";
import {
  DitherConfig,
  getResponsiveConfig,
  resolveDitherConfig,
} from "@/lib/ditherConfig";
import { DitherRenderer } from "./DitherShader";

interface DitherImageProps {
  config?: Partial<DitherConfig>;
  className?: string;
}

// NOTE: the raw <img> is never shown — it exists purely as a texture
// source for the WebGL canvas on top of it, uploaded once (see
// DitherShader.ts). The canvas itself gets a slow CSS "Ken Burns" drift
// (see .dither-kenburns in globals.css) plus the shader's own per-cell
// breathing + mouse ripple, so a still photo still feels alive.
export default function DitherImage({ config, className = "" }: DitherImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rendererRef = useRef<DitherRenderer | null>(null);
  const baseConfig = resolveDitherConfig({ sourceMode: "image", ...config });

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    let renderer: DitherRenderer | null = null;
    let cancelled = false;

    const init = () => {
      if (cancelled || renderer) return;
      try {
        renderer = new DitherRenderer(
          canvas,
          img,
          getResponsiveConfig(baseConfig, window.innerWidth)
        );
        rendererRef.current = renderer;
        renderer.start();
      } catch (e) {
        console.warn("Dither image renderer failed to init:", e);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      init();
    } else {
      img.addEventListener("load", init, { once: true });
    }

    return () => {
      cancelled = true;
      img.removeEventListener("load", init);
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={baseConfig.imageSrc}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="dither-kenburns absolute inset-0 h-full w-full"
      />
    </div>
  );
}
