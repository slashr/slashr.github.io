import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p>The projects and the old writing are still here.</p>
      <div>
        <Link className="button button-primary" href="/">
          Personal projects
        </Link>
        <Link className="button" href="/blog/">
          Blog archive
        </Link>
      </div>
    </main>
  );
}
