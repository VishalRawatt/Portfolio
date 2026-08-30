// Pure WebGL renderer for the real-time dither effect.
// Deliberately framework-free so all GL state lives outside React's
// render cycle — React only ever mounts/unmounts a canvas and forwards
// config + pointer events into this class.
//
// Supports three source modes, all running through the same dot/bayer
// pipeline:
//   - "video": samples an HTMLVideoElement frame each tick.
//   - "image": uploads a single HTMLImageElement once (cheap — no
//     per-frame decode), used for static photos treated with the effect.
//   - "generative": no media at all — a seeded fbm noise field stands in
//     for luminance, so sections that don't have unique footage still
//     look distinct from each other instead of repeating one clip.

import { DitherConfig } from "@/lib/ditherConfig";

const VERTEX_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uMedia;
uniform vec2 uResolution;   // canvas size in device pixels
uniform vec2 uMediaSize;    // intrinsic video/image size, for aspect-fit
uniform float uTime;
uniform float uDotSize;     // in device pixels
uniform float uIntensity;
uniform float uContrast;
uniform float uBrightness;
uniform int uAlgorithm;     // 0 = halftone, 1 = bayer4, 2 = bayer8
uniform vec3 uColor;
uniform vec3 uBgColor;
uniform float uAnimSpeed;
uniform vec2 uMouse;        // 0..1, uv space
uniform float uMouseStrength;
uniform float uMouseActive;
uniform int uSourceMode;    // 0 = texture (video/image), 1 = generative
uniform float uSeed;
uniform vec2 uFlowDir;
uniform float uFlowSpeed;

float luminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// 4x4 Bayer threshold matrix, normalized 0..1
float bayer4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  float m[16];
  m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
  m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
  m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
  int idx = y * 4 + x;
  for (int i = 0; i < 16; i++) {
    if (i == idx) return m[i] / 16.0;
  }
  return 0.0;
}

// 8x8 Bayer, built by tiling the 4x4 matrix twice (cheap approximation
// that still reads as a finer ordered-dither grid on screen).
float bayer8(vec2 p) {
  vec2 p2 = mod(p, 8.0);
  float base = bayer4(mod(p2, 4.0));
  float quadrant = (floor(p2.x / 4.0) + floor(p2.y / 4.0) * 2.0);
  return fract(base + quadrant * 0.0625);
}

// aspect-fit (cover) uv mapping from screen space into video uv space
vec2 coverUv(vec2 screenUv, vec2 res, vec2 media) {
  float screenAspect = res.x / res.y;
  float mediaAspect = media.x / media.y;
  vec2 uv = screenUv;
  if (screenAspect > mediaAspect) {
    float scale = screenAspect / mediaAspect;
    uv.y = (uv.y - 0.5) * scale + 0.5;
  } else {
    float scale = mediaAspect / screenAspect;
    uv.x = (uv.x - 0.5) * scale + 0.5;
  }
  return uv;
}

// --- value noise + fbm, used for the "generative" source mode ---
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * valueNoise(p);
    p *= 2.02;
    amp *= 0.55;
  }
  return sum;
}

void main() {
  vec2 fragPx = vUv * uResolution;

  // Cell grid in device pixels
  vec2 cell = floor(fragPx / uDotSize);
  vec2 cellCenterPx = (cell + 0.5) * uDotSize;
  vec2 cellUv = cellCenterPx / uResolution;

  // Mouse ripple: push the sample point away from the cursor with a soft
  // radial falloff, and add a slow decaying ring so it feels alive.
  vec2 toMouse = cellUv - uMouse;
  float distToMouse = length(toMouse * vec2(uResolution.x / uResolution.y, 1.0));
  float ripple = exp(-distToMouse * 6.0) * uMouseActive * uMouseStrength;
  vec2 displaced = cellUv + normalize(toMouse + 0.0001) * ripple * 0.06;

  float lum;

  if (uSourceMode == 0) {
    vec2 mediaUv = coverUv(displaced, uResolution, uMediaSize);
    mediaUv = clamp(mediaUv, 0.0, 1.0);
    vec3 srcColor = texture2D(uMedia, mediaUv).rgb;
    lum = luminance(srcColor);
  } else {
    // Generative: a drifting fbm field stands in for luminance so this
    // instance reads as its own visual rather than reused footage.
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = displaced * aspect * 3.2 + uSeed * 17.0;
    p += uFlowDir * uTime * uFlowSpeed;
    lum = fbm(p);
    lum = smoothstep(0.15, 0.85, lum);
  }

  lum = clamp((lum - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);

  // Local brightness boost near the cursor so the ripple reads visually.
  lum = clamp(lum + ripple * 0.5, 0.0, 1.0);

  // Subtle per-cell "breathing" so the field doesn't feel like a static
  // filter even on paused frames.
  float hash = fract(sin(dot(cell, vec2(12.9898, 78.233)) + uSeed) * 43758.5453);
  float breathe = sin(uTime * uAnimSpeed * 1.4 + hash * 6.2831) * 0.03;
  lum = clamp(lum + breathe, 0.0, 1.0);

  vec3 outColor;

  if (uAlgorithm == 0) {
    // Halftone: dot radius grows with brightness.
    vec2 localPx = mod(fragPx, uDotSize) - uDotSize * 0.5;
    float maxR = uDotSize * 0.5 * 0.92;
    float r = sqrt(clamp(lum * uIntensity, 0.0, 1.0)) * maxR;
    float d = length(localPx);
    float mask = 1.0 - smoothstep(r - 1.0, r + 1.0, d);
    outColor = mix(uBgColor, uColor, mask);
  } else {
    // Ordered dithering (Bayer 4x4 / 8x8): binary on/off per source pixel,
    // sampled at native resolution so it still reads as a fine dot texture.
    vec2 ditherPx = floor(fragPx / max(uDotSize * 0.34, 1.0));
    float threshold = (uAlgorithm == 1) ? bayer4(ditherPx) : bayer8(ditherPx);
    float on = step(threshold, lum * uIntensity);
    outColor = mix(uBgColor, uColor, on);
  }

  gl_FragColor = vec4(outColor, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader compile error: " + info);
  }
  return shader;
}

const ALGO_MAP: Record<DitherConfig["algorithm"], number> = {
  halftone: 0,
  bayer4: 1,
  bayer8: 2,
};

type MediaSource = HTMLVideoElement | HTMLImageElement | null;

export class DitherRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private canvas: HTMLCanvasElement;
  private media: MediaSource;
  private texture: WebGLTexture;
  private imageUploaded = false;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private rafId = 0;
  private startTime = performance.now();
  private mouse = { x: 0.5, y: 0.5, active: 0 };
  private mouseTargetActive = 0;
  private config: DitherConfig;
  private disposed = false;

  /**
   * @param media An HTMLVideoElement (re-uploaded every frame), an
   * HTMLImageElement (uploaded once), or null to force generative-only
   * rendering — used by <DitherField />.
   */
  constructor(canvas: HTMLCanvasElement, media: MediaSource, config: DitherConfig) {
    this.canvas = canvas;
    this.media = media;
    this.config = config;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;

    // Video/image pixel data is top-left-origin; WebGL textures expect
    // bottom-left-origin. Without this every video/photo renders upside
    // down. This one call fixes that for every texImage2D upload below.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Program link error: " + gl.getProgramInfoLog(program));
    }
    this.program = program;
    gl.useProgram(program);

    // Full-screen triangle (covers clip space with only 3 verts)
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Seed the texture with an opaque black pixel so the very first frame
    // (before any video data or generative branch matters) never shows
    // garbage — it just reads as "no light", i.e. dots off.
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0])
    );
    this.texture = texture;

    [
      "uMedia",
      "uResolution",
      "uMediaSize",
      "uTime",
      "uDotSize",
      "uIntensity",
      "uContrast",
      "uBrightness",
      "uAlgorithm",
      "uColor",
      "uBgColor",
      "uAnimSpeed",
      "uMouse",
      "uMouseStrength",
      "uMouseActive",
      "uSourceMode",
      "uSeed",
      "uFlowDir",
      "uFlowSpeed",
    ].forEach((name) => {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    });

    this.resize();
  }

  setConfig(config: DitherConfig) {
    this.config = config;
  }

  setMouse(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouseTargetActive = 1;
  }

  clearMouse() {
    this.mouseTargetActive = 0;
  }

  resize() {
    const { canvas, gl, config } = this;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * config.resolutionScale;
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  private uploadFrame() {
    const { gl, media, texture, config } = this;
    if (!media) return;

    if (config.sourceMode === "video" && media instanceof HTMLVideoElement) {
      if (media.readyState < media.HAVE_CURRENT_DATA) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, media);
      } catch {
        // Not decodable yet on this frame — skip silently.
      }
      return;
    }

    if (config.sourceMode === "image" && media instanceof HTMLImageElement) {
      // Static image — upload exactly once, never again.
      if (this.imageUploaded || !media.complete || media.naturalWidth === 0) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, media);
        this.imageUploaded = true;
      } catch {
        // Image not decoded yet — try again next frame.
      }
    }
  }

  private getMediaSize(): [number, number] {
    const { media } = this;
    if (media instanceof HTMLVideoElement) {
      return [media.videoWidth || 16, media.videoHeight || 9];
    }
    if (media instanceof HTMLImageElement) {
      return [media.naturalWidth || 16, media.naturalHeight || 9];
    }
    return [16, 9];
  }

  private render = () => {
    if (this.disposed) return;
    const { gl, program, uniforms, config, canvas } = this;

    this.uploadFrame();

    this.mouse.active += (this.mouseTargetActive - this.mouse.active) * 0.08;

    gl.useProgram(program);
    gl.uniform1i(uniforms.uMedia, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    const [mw, mh] = this.getMediaSize();
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.uMediaSize, mw, mh);
    gl.uniform1f(uniforms.uTime, (performance.now() - this.startTime) / 1000);
    gl.uniform1f(uniforms.uDotSize, config.dotSize * (window.devicePixelRatio || 1) * config.resolutionScale);
    gl.uniform1f(uniforms.uIntensity, config.intensity);
    gl.uniform1f(uniforms.uContrast, config.contrast);
    gl.uniform1f(uniforms.uBrightness, config.brightness);
    gl.uniform1i(uniforms.uAlgorithm, ALGO_MAP[config.algorithm]);
    gl.uniform3f(uniforms.uColor, ...config.color);
    gl.uniform3f(uniforms.uBgColor, ...config.backgroundColor);
    gl.uniform1f(uniforms.uAnimSpeed, config.animationSpeed);
    gl.uniform2f(uniforms.uMouse, this.mouse.x, 1 - this.mouse.y);
    gl.uniform1f(uniforms.uMouseStrength, config.mouseStrength);
    gl.uniform1f(uniforms.uMouseActive, this.mouse.active);
    gl.uniform1i(uniforms.uSourceMode, config.sourceMode === "generative" ? 1 : 0);
    gl.uniform1f(uniforms.uSeed, config.seed);
    gl.uniform2f(uniforms.uFlowDir, config.flowDirection[0], config.flowDirection[1]);
    gl.uniform1f(uniforms.uFlowSpeed, config.flowSpeed);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.rafId = requestAnimationFrame(this.render);
  };

  start() {
    if (!this.rafId) this.rafId = requestAnimationFrame(this.render);
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  dispose() {
    this.disposed = true;
    this.stop();
    const { gl } = this;
    gl.deleteTexture(this.texture);
    gl.deleteProgram(this.program);
  }
}
