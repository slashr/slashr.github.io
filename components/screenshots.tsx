"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Project } from "@/lib/projects";

export function Screenshots({ project }: { project: Project }) {
  const [index, setIndex] = useState(0),
    [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const screenshot = project.screenshots[index];
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [open]);
  return (
    <figure
      className={`screenshots ${project.id === "power-hour" ? "portrait" : "landscape"}`}
    >
      <button
        className="screenshot-open"
        type="button"
        aria-label={`Enlarge ${project.name} screenshot`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={screenshot.src}
          width={screenshot.width}
          height={screenshot.height}
          alt={screenshot.alt}
          sizes={
            project.id === "power-hour"
              ? "(max-width: 600px) 65vw, 260px"
              : "(max-width: 760px) 90vw, 800px"
          }
          priority={project.id === "power-hour" && index === 0}
        />
        <span className="enlarge-label">
          <Maximize2 size={12} aria-hidden="true" />
          Enlarge
        </span>
      </button>
      <figcaption>{screenshot.caption}</figcaption>
      <div className="screenshot-controls">
        <button
          type="button"
          className="icon-button"
          aria-label={`Previous ${project.name} screenshot`}
          onClick={() =>
            setIndex(
              (index + project.screenshots.length - 1) %
                project.screenshots.length,
            )
          }
        >
          <ChevronLeft size={15} />
        </button>
        <span>
          {index + 1} / {project.screenshots.length}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label={`Next ${project.name} screenshot`}
          onClick={() => setIndex((index + 1) % project.screenshots.length)}
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <dialog
        ref={dialog}
        className="screenshot-dialog"
        aria-labelledby={`${project.id}-lightbox-title`}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="lightbox-header">
          <h2 id={`${project.id}-lightbox-title`}>
            {project.name} <span>{screenshot.caption}</span>
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close screenshot"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <Image
          src={screenshot.src}
          width={screenshot.width}
          height={screenshot.height}
          alt={screenshot.alt}
          sizes="90vw"
        />
      </dialog>
    </figure>
  );
}
