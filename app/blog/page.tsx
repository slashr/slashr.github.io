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
        <h1>Blog archive</h1>
        <p>
          An archive of past write-ups on challenging tasks I've worked through.
        </p>
      </header>
      <BlogArchive posts={posts} />
    </main>
  );
}
