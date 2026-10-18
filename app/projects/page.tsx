import type { Metadata } from "next";
import { Workbench } from "@/components/workbench";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Power Hour, iNAB, and my homelab. Apps and systems I build and use.",
  alternates: { canonical: "/projects/" },
};

export default function Projects() {
  return (
    <main id="main" className="projects-page">
      <header className="intro projects-intro">
        <div>
          <span className="eyebrow">The workbench</span>
          <h1>Things I make.</h1>
          <p>Personal apps and infrastructure. Built for my own day-to-day.</p>
        </div>
        <span className="project-page-note">
          03 projects · always tinkering
        </span>
      </header>
      <Workbench />
    </main>
  );
}
