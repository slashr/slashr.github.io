"use client";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
type Post = {
  title: string;
  url: string;
  year: string;
  date: string;
  tags: string[];
  externalUrl: string | null;
};
export function BlogArchive({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const needle = query.toLocaleLowerCase().trim();
  const filtered = posts.filter((post) =>
    `${post.title} ${post.year} ${post.tags.join(" ")}`
      .toLocaleLowerCase()
      .includes(needle),
  );
  const years = Array.from(new Set(filtered.map((post) => post.year)));
  return (
    <div className="archive-list">
      <label className="archive-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          aria-label="Search archived posts"
          placeholder="Find a post…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p className="result-count" role="status">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
      </p>
      {years.map((year) => (
        <section
          className="archive-year"
          key={year}
          aria-label={`Posts from ${year}`}
        >
          <h2>{year}</h2>
          <div>
            {filtered
              .filter((post) => post.year === year)
              .map((post) => (
                <a className="archive-entry" href={post.url} key={post.url}>
                  <span>
                    {post.title}
                    <small>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(post.date))}
                      {post.externalUrl ? " · Medium entry" : ""}
                    </small>
                  </span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
