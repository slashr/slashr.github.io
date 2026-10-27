"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Timer, Wallet, Network } from "lucide-react";
import { projects, type ProjectId, type Project } from "@/lib/projects";
import { HomelabArchitecture } from "./homelab-architecture";
import { Screenshots } from "./screenshots";
import { usePreferences } from "./preferences";
const icons = { "power-hour": Timer, inab: Wallet, homelab: Network };
function ProjectPanel({
  project,
  active,
}: {
  project: Project;
  active: boolean;
}) {
  const { motion: animated } = usePreferences();
  const isLab = project.id === "homelab";
  return (
    <motion.section
      className={`project-panel ${project.id === "inab" ? "wide-panel" : ""} ${isLab ? "lab-panel" : ""}`}
      role="tabpanel"
      id={`panel-${project.id}`}
      aria-labelledby={`tab-${project.id}`}
      hidden={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
      transition={{ duration: animated ? 0.3 : 0 }}
    >
      <div className="project-topline">
        <span>{project.type}</span>
      </div>
      <div className="project-body">
        <div className="project-copy">
          <div className="project-number">
            0{projects.findIndex((p) => p.id === project.id) + 1}{" "}
            <span>/ 03</span>
          </div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          {!isLab && (
            <>
              <div className="tech-stack">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <details className="project-notes">
                <summary>
                  More about the project <span aria-hidden="true">+</span>
                </summary>
                <ul>
                  {project.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </div>
        <div className={`project-preview ${isLab ? "lab-preview" : ""}`}>
          {isLab ? <HomelabArchitecture /> : <Screenshots project={project} />}
        </div>
      </div>
    </motion.section>
  );
}
export function Workbench() {
  const [selected, setSelected] = useState<ProjectId>("power-hour");
  const [horizontal, setHorizontal] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const { motion: animated } = usePreferences();
  useEffect(() => {
    const syncHash = () => {
      const id = location.hash.slice(1);
      if (projects.some((p) => p.id === id)) setSelected(id as ProjectId);
      else if (!id) setSelected("power-hour");
    };
    const media = matchMedia("(max-width: 760px)");
    const syncLayout = () => setHorizontal(media.matches);
    syncHash();
    syncLayout();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    media.addEventListener("change", syncLayout);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
      media.removeEventListener("change", syncLayout);
    };
  }, []);
  const select = (id: ProjectId) => {
    if (id !== selected) {
      setSelected(id);
      history.pushState(null, "", "#" + id);
    }
  };
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target: number;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      target = (index + 1) % projects.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      target = (index + projects.length - 1) % projects.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = projects.length - 1;
    else return;
    event.preventDefault();
    select(projects[target].id);
    buttons.current[target]?.focus();
  };
  return (
    <div className="workbench" data-project={selected} id="projects">
      <aside className="project-rail">
        <span className="rail-heading">Projects</span>
        <div
          className="project-tabs"
          role="tablist"
          aria-label="Choose a project"
          aria-orientation={horizontal ? "horizontal" : "vertical"}
        >
          {projects.map((project, index) => {
            const Icon = icons[project.id];
            const active = selected === project.id;
            return (
              <button
                key={project.id}
                type="button"
                className="project-tab"
                data-project={project.id}
                role="tab"
                id={`tab-${project.id}`}
                aria-selected={active}
                aria-controls={`panel-${project.id}`}
                tabIndex={active ? 0 : -1}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                onClick={() => select(project.id)}
                onKeyDown={(event) => keyboard(event, index)}
              >
                {active && (
                  <motion.span
                    className="tab-selection"
                    layoutId="project-selection"
                    transition={{
                      duration: animated ? 0.3 : 0,
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                  />
                )}
                <span className="project-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="tab-copy">
                  <strong>{project.name}</strong>
                  <small>{project.short}</small>
                </span>
              </button>
            );
          })}
        </div>
      </aside>
      <div className="project-stage">
        {projects.map((project) => (
          <ProjectPanel
            key={project.id}
            project={project}
            active={selected === project.id}
          />
        ))}
      </div>
    </div>
  );
}
