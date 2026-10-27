"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";

type Theme = "system" | "light" | "dark";
type Preference = "system" | "on" | "off";
const Context = createContext({
  dark: false,
  motion: false,
  toggleTheme() {},
});
export const usePreferences = () => useContext(Context);
export function Preferences({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [animation, setAnimation] = useState<Preference>("system");
  const [systemDark, setSystemDark] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const color = matchMedia("(prefers-color-scheme: dark)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSystemDark(color.matches);
      setReduced(motion.matches);
    };
    sync();
    try {
      const savedTheme = localStorage.getItem("slashr-theme");
      const savedMotion = localStorage.getItem("slashr-motion");
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
      if (savedMotion === "on" || savedMotion === "off")
        setAnimation(savedMotion);
    } catch {
      /* System defaults also work when storage is blocked. */
    }
    setReady(true);
    color.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      color.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);
  const dark = theme === "system" ? systemDark : theme === "dark";
  const motion = animation === "system" ? !reduced : animation === "on";
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.motion = motion ? "on" : "off";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem("slashr-theme", theme);
      localStorage.setItem("slashr-motion", animation);
    } catch {
      /* Preference changes still work for the current page. */
    }
  }, [theme, animation, dark, motion, ready]);
  return (
    <Context.Provider
      value={{
        dark,
        motion: ready && motion,
        toggleTheme: () => setTheme(dark ? "light" : "dark"),
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Context.Provider>
  );
}
