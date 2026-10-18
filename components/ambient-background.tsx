"use client";
import { useEffect, useRef } from "react";
import { usePreferences } from "./preferences";

export function AmbientBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { motion, dark } = usePreferences();
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    let width = 0,
      height = 0,
      frame = 0,
      previous = 0;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    function draw(delta = 0) {
      if (!context || !element) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = context.strokeStyle = getComputedStyle(element).color;
      for (const node of nodes) {
        node.x = (node.x + node.vx * delta + width) % width;
        node.y = (node.y + node.vy * delta + height) % height;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j],
            distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 140) {
            context.globalAlpha = (1 - distance / 140) * 0.15;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
        context.globalAlpha = 0.35;
        context.beginPath();
        context.arc(a.x, a.y, i % 5 === 0 ? 1.8 : 1.1, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    }
    function resize() {
      if (!element || !context) return;
      width = element.clientWidth;
      height = element.clientHeight;
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * scale);
      element.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      nodes = Array.from({ length: width < 600 ? 22 : 45 }, (_, i) => ({
        x: (((i * 179 + 29) % 997) / 997) * width,
        y: (((i * 257 + 53) % 991) / 991) * height,
        vx: Math.cos(i * 2.4) * 5,
        vy: Math.sin(i * 1.7 + 1) * 5,
      }));
      draw();
    }
    function tick(time: number) {
      frame = 0;
      if (!motion || document.hidden) return;
      if (time - previous >= 32) {
        draw(Math.min((time - (previous || time)) / 1000, 0.05));
        previous = time;
      }
      frame = requestAnimationFrame(tick);
    }
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (motion && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [motion, dark]);
  return (
    <div className="ambient" aria-hidden="true">
      <div className="light-wash wash-maroon" />
      <div className="light-wash wash-lilac" />
      <div className="light-wash wash-peach" />
      <canvas className="ambient-network" ref={canvas} />
    </div>
  );
}
