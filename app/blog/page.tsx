import type { Metadata } from "next";
import { readPosts } from "@/lib/archive.mjs";
import { BlogArchive } from "@/components/blog-archive";
export const metadata: Metadata = {
  title: "Blog archive",
  description: "Archived writing by Akash Nair from 2015 to 2022.",
  alternates: { canonical: "/blog/" },
};
export default function Blog() {
  const posts = readPosts().map(
    ({ title, url, year, date, tags, externalUrl }) => ({
      title,
      url,
      year,
      date,
      tags,
      externalUrl,
    }),
  );
  return (
    <main id="main" className="blog-page">
      <header className="blog-intro">
        <span className="eyebrow">2015–2022</span>
        <h1>Blog archive</h1>
        <p>
          I used to write about AWS, Kubernetes, and infrastructure. I've kept
          those posts here, with their original dates and links.
        </p>
      </header>
      <BlogArchive posts={posts} />
    </main>
  );
}
