import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/src/lib/siteUrl";
import { DEFAULT_OG_IMAGE } from "@/src/lib/pageMetadata";
import "./globals.css";

const defaultDescription =
  "Presentiq designs presentations, documents, and visual systems that turn your strategy into something people actually understand.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Presentiq",
    template: "%s | Presentiq",
  },
  description: defaultDescription,
  // Google Search Console ownership (URL-prefix property).
  verification: {
    google: "eIToGIhuCy8HWWXtDLYtsDXVEAdf99nnbdzHTkWAOCk",
  },
  openGraph: {
    siteName: "Presentiq",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

// Colours the browser UI (Android address bar, Safari tab bar) in the
// site's navy.
export const viewport: Viewport = {
  themeColor: "#000023",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") ?? "de";

  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}
