import type { Metadata } from "next";
import { Preferences } from "@/components/preferences";
import { AmbientBackground } from "@/components/ambient-background";
import { Header, Footer } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://slashr.github.io"),
  title: { default: "Akash Nair / slashr", template: "%s · Akash Nair" },
  description:
    "Personal projects by Akash Nair, a DevOps engineer in Berlin. Power Hour, iNAB, and a self-hosted homelab.",
  openGraph: {
    title: "Akash Nair / slashr",
    description: "Apps, infrastructure, and personal projects.",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};
const themeScript = `(function(){try{var t=localStorage.getItem('slashr-theme'),m=localStorage.getItem('slashr-motion');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.colorScheme=d?'dark':'light';document.documentElement.dataset.motion=(m==='off'||(m!=='on'&&matchMedia('(prefers-reduced-motion: reduce)').matches))?'off':'on';}catch(e){}})();`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Preferences>
          <AmbientBackground />
          <div className="site-wrap">
            <Header />
            {children}
            <Footer />
          </div>
        </Preferences>
      </body>
    </html>
  );
}
