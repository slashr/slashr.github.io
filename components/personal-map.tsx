"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Dumbbell, Wallet, Network } from "lucide-react";

const interests = [
  {
    id: "training",
    label: "Training",
    icon: Dumbbell,
    project: "power-hour",
    name: "Power Hour",
    note: "I made an app for the workouts I do at the gym.",
  },
  {
    id: "finance",
    label: "Personal finance",
    icon: Wallet,
    project: "inab",
    name: "iNAB",
    note: "My own place to keep track of budgets, spending, and investments.",
  },
  {
    id: "systems",
    label: "Self-hosting",
    icon: Network,
    project: "homelab",
    name: "Homelab",
    note: "Raspberry Pis, cloud nodes, and the services I run on them.",
  },
] as const;

export function PersonalMap() {
  const [selected, setSelected] = useState(0);
  const current = interests[selected];
  return (
    <section
      className="personal-map"
      aria-label="Outside work"
      data-interest={current.id}
    >
      <div className="map-heading">
        <span className="eyebrow">Outside work</span>
        <span className="map-instruction">A few connected interests</span>
      </div>
      <div className="interest-constellation">
        <svg
          className="constellation-lines"
          viewBox="0 0 480 400"
          aria-hidden="true"
        >
          <circle cx="240" cy="200" r="116" className="orbit-track" />
          <circle
            cx="240"
            cy="200"
            r="165"
            className="orbit-track outer-track"
          />
          <path d="M240 200 Q155 190 105 97 M240 200 Q335 215 377 114 M240 200 Q215 285 269 333" />
          <g className="orbit-drift">
            <circle cx="240" cy="84" r="4" />
            <circle cx="240" cy="365" r="3" />
          </g>
        </svg>
        <div className="map-monogram" aria-hidden="true">
          <span>
            an<span>.</span>
          </span>
          <small>slashr</small>
        </div>
        <div role="group" aria-label="Explore my interests">
          {interests.map((interest, index) => {
            const Icon = interest.icon;
            return (
              <button
                key={interest.id}
                type="button"
                className={`interest-node interest-${interest.id}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span className="interest-symbol">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <span>{interest.label}</span>
              </button>
            );
          })}
        </div>
        <span className="map-annotation" aria-hidden="true">
          a little bit of everything
        </span>
      </div>
      <div className="interest-detail" aria-live="polite" aria-atomic="true">
        <div>
          <span className="interest-count">0{selected + 1} / 03</span>
          <p>{current.note}</p>
        </div>
        <Link
          href={`/projects/#${current.project}`}
          aria-label={`Explore ${current.name}`}
        >
          {current.name}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
