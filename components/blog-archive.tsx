import { ArrowUpRight } from "lucide-react";
type Post = {
  title: string;
  url: string;
  year: string;
  date: string;
  tags: string[];
  externalUrl: string | null;
};
export function BlogArchive({ posts }: { posts: Post[] }) {
  const years = Array.from(new Set(posts.map((post) => post.year)));
  return (
    <div className="archive-list">
      <p className="result-count">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>
      {years.map((year) => (
        <section
          className="archive-year"
          key={year}
          aria-label={`Posts from ${year}`}
        >
          <h2>{year}</h2>
          <div>
            {posts
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
