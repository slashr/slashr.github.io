"use client";
import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const background = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => {
      if (background.current)
        background.current.dataset.hidden = String(document.hidden);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return (
    <div className="ambient" aria-hidden="true" ref={background}>
      <div className="ambient-gradient" />
    </div>
  );
}
