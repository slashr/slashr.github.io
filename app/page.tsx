import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PersonalMap } from "@/components/personal-map";

export default function Home() {
  return (
    <main id="main" className="about-page">
      <section className="about-spread" aria-labelledby="about-title">
        <div className="about-copy">
          <span className="eyebrow about-hello">Hello, I'm</span>
          <h1 id="about-title">
            Akash
            <br />
            Nair<span className="name-period">.</span>
          </h1>
          <p className="about-role">
            DevOps engineer.
            <br />
            Usually building something.
          </p>
          <span className="location about-location">
            <MapPin size={13} aria-hidden="true" />
            Berlin, Germany
          </span>
          <div className="about-story">
            <p>
              You might know me as <span className="inline-handle">slashr</span>
              . I work on infrastructure, and spend a fair bit of my spare time
              making things I use myself.
            </p>
            <p>
              A workout app for the gym. A way to make sense of my finances. A
              small cluster of machines to run my apps and services.
            </p>
          </div>
          <Link className="about-project-link" href="/projects/">
            See what I'm working on{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <PersonalMap />
      </section>
      <div className="about-margin-note">
        <span>Akash in person. slashr on the internet.</span>
        <span>
          Always a work in progress <span aria-hidden="true">↗</span>
        </span>
      </div>
    </main>
  );
}
