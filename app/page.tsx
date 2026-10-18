import { Workbench } from "@/components/workbench";
import { readPosts } from "@/lib/archive.mjs";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
export default function Home() {
  const posts = readPosts();
  return (
    <main id="main">
      <section className="intro">
        <div>
          <h1>Akash Nair</h1>
          <p>
            DevOps engineer. These are the apps and systems I work on outside of
            my day job.
          </p>
        </div>
        <span className="location">
          <MapPin size={13} aria-hidden="true" />
          Berlin, Germany
        </span>
      </section>
      <Workbench />
      <section className="archive-teaser" aria-label="Earlier writing">
        <div>
          <Link href="/blog/">
            Blog archive <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <span>{posts.length} posts · 2015–2022</span>
        </div>
        <p>
          I used to write about AWS, Kubernetes, and infrastructure. Those posts
          are still here.
        </p>
      </section>
    </main>
  );
}
