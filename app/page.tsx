import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { DeskCompanion } from "@/components/desk-companion";

export default function Home() {
  return (
    <main id="main" className="about-page">
      <section className="about-spread" aria-labelledby="about-title">
        <div className="about-copy">
          <span className="eyebrow about-hello">Hello, I'm</span>
          <h1 id="about-title">
            Akash Nair<span className="name-period">.</span>
          </h1>
          <span className="location about-location">
            <MapPin size={13} aria-hidden="true" />
            Berlin, Germany
          </span>
          <div className="about-story">
            <p>
              I like seeing network entropy reduce, servers align and
              infrastructure converge to code.
            </p>
          </div>
          <Link className="about-project-link" href="/projects/">
            See what I'm working on{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <DeskCompanion />
      </section>
    </main>
  );
}
