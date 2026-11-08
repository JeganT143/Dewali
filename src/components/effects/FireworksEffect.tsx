"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
}

const COLORS = ["#FFC928", "#FFE082", "#F28C28", "#FFF5DC", "#E87518"];
const GRAVITY = 0.035;
const DRAG = 0.985;

type Burst = (fx: number, fy: number, scale?: number) => void;

interface FireworksEffectProps {
  /** Each increase plays a short show of four golden bursts. */
  trigger: number;
  /** When true, a single soft burst appears every 20–34 s (never continuous). */
  ambient?: boolean;
}

/**
 * Canvas fireworks. The animation loop runs only while sparks are alive,
 * nothing is drawn while the tab is hidden, and the whole effect is absent
 * with reduced motion.
 */
export function FireworksEffect({ trigger, ambient = false }: FireworksEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstRef = useRef<Burst | null>(null);
  const reducedMotion = useReducedMotion();

  // Engine: canvas sizing, particle loop, visibility handling.
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let frame = 0;

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= DRAG;
        p.vy = p.vy * DRAG + GRAVITY;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = particles.length ? requestAnimationFrame(tick) : 0;
    };

    burstRef.current = (fx, fy, scale = 1) => {
      if (document.hidden) return;
      const x = window.innerWidth * fx;
      const y = window.innerHeight * fy;
      const count = Math.round(46 * scale);
      const speed = (2.2 + Math.random() * 1.6) * Math.sqrt(scale);
      const tint = COLORS[Math.floor(Math.random() * 3)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
        const v = speed * (0.65 + Math.random() * 0.35);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
          life: 1,
          decay: 0.011 + Math.random() * 0.01,
          color: Math.random() < 0.6 ? tint : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.3 + Math.random() * 1.5,
        });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && particles.length && !frame) {
        frame = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      burstRef.current = null;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  // Celebration show.
  useEffect(() => {
    if (trigger === 0 || reducedMotion) return;
    const timers = [
      [0.22, 0.2, 150],
      [0.78, 0.16, 520],
      [0.5, 0.1, 900],
      [0.35, 0.28, 1350],
    ].map(([fx, fy, delay]) => window.setTimeout(() => burstRef.current?.(fx, fy), delay));
    return () => timers.forEach(clearTimeout);
  }, [trigger, reducedMotion]);

  // Occasional ambient bursts.
  useEffect(() => {
    if (!ambient || reducedMotion) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        burstRef.current?.(0.15 + Math.random() * 0.7, 0.08 + Math.random() * 0.2, 0.7);
        schedule();
      }, 20_000 + Math.random() * 14_000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [ambient, reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 size-full" />;
}
