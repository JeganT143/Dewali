"use client";

import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import "./reveal.css";

interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  as?: "div" | "section";
  /** Extra delay before the reveal transition starts, in ms. */
  delay?: number;
}

/**
 * Fades and lifts its content in the first time it scrolls into view.
 *
 * The server markup is always visible: content is only hidden after mount,
 * and only when it is below the fold, IntersectionObserver exists and the
 * visitor has not asked for reduced motion. Content already on screen at
 * mount is left alone. Only opacity and transform change, so nothing shifts.
 */
export function Reveal({ children, className, as: Tag = "div", delay = 0, style, ...rest }: RevealProps) {
  // Typed as a div so it fits both tags; only HTMLElement members are used.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.dataset.reveal === "shown") return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already on screen

    // Very tall content could never reach 15% visibility; ask for less.
    const threshold = Math.min(0.15, (window.innerHeight * 0.5) / Math.max(rect.height, 1));
    el.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
