"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Moon, Sun, Pause, Play, ArrowUpRight } from "lucide-react";
import { usePreferences } from "./preferences";

export function Header() {
  const { dark, toggleTheme, motion: animated } = usePreferences();
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "About" },
    { href: "/projects/", label: "Projects" },
    { href: "/blog/", label: "Blog" },
  ];
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        slashr<span>/ Akash Nair</span>
      </Link>
      <nav aria-label="Main navigation">
        <div className="page-tabs">
          {tabs.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href.slice(0, -1));
            return (
              <Link
                key={href}
                href={href}
                className="page-tab"
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    className="page-tab-selection"
                    layoutId="page-selection"
                    transition={{ duration: animated ? 0.28 : 0 }}
                  />
                )}
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <button
          className="icon-button theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
    </header>
  );
}
export function Footer() {
  const { motion, toggleMotion } = usePreferences();
  return (
    <footer className="site-footer">
      <div>
        <a
          href="https://github.com/slashr"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowUpRight size={12} aria-hidden="true" />
        </a>
        <a
          href="https://www.linkedin.com/in/akashnair/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
      <button
        type="button"
        className="motion-toggle"
        aria-pressed={!motion}
        onClick={toggleMotion}
      >
        {motion ? (
          <Pause size={12} aria-hidden="true" />
        ) : (
          <Play size={12} aria-hidden="true" />
        )}
        {motion ? "Pause background" : "Play background"}
      </button>
    </footer>
  );
}
