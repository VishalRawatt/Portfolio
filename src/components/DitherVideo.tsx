"use client";

import { PointerEventHandler, useEffect, useRef } from "react";
import {
  DitherConfig,
  getResponsiveConfig,
  resolveDitherConfig,
} from "@/lib/ditherConfig";
import { DitherRenderer } from "./DitherShader";

interface DitherVideoProps {
  config?: Partial<DitherConfig>;
  className?: string;
  /** Only start decoding/rendering once this becomes true (lazy-load). */
  active?: boolean;
  scrollScale?: number; // 1 = no zoom; used by Hero on scroll
}

// NOTE: the raw <video> element is never shown — it exists purely as a
// texture source for the WebGL canvas on top of it. The canvas is drawn
// from frame one (seeded with a black 1x1 texture, see DitherShader.ts),
// so visitors only ever see the dithered result, never the source
// footage flashing in first.
export default function DitherVideo({
  config,
  className = "",
  active = true,
  scrollScale = 1,
}: DitherVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<DitherRenderer | null>(null);
  const baseConfig = resolveDitherConfig({ sourceMode: "video", ...config });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let renderer: DitherRenderer | null = null;
    let cancelled = false;

    const init = () => {
      if (cancelled || renderer) return;
      try {
        renderer = new DitherRenderer(
          canvas,
          video,
          getResponsiveConfig(baseConfig, window.innerWidth)
        );
        rendererRef.current = renderer;
        renderer.start();
      } catch (e) {
        console.warn("Dither renderer failed to init:", e);
      }
    };

    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      init();
    } else {
      video.addEventListener("loadeddata", init, { once: true });
    }

    video.play().catch(() => {
      /* autoplay can be blocked until user interaction; ignored */
    });

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", init);
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const v = videoRef.current;
      if (!r || !v) return;
      if (document.hidden) {
        r.stop();
        v.pause();
      } else {
        r.start();
        v.play().catch(() => {});
      }
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
      <video
        ref={videoRef}
        src={baseConfig.videoSrc}
        muted
        loop
        playsInline
        autoPlay
        preload={active ? "auto" : "none"}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{ transform: `scale(${scrollScale})` }}
      />
    </div>
  );
}
