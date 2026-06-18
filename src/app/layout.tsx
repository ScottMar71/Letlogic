import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — UK tenant screening`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: "/brand/icon.svg",
    apple: "/brand/icon.svg",
  },
  verification: {
    google: "-HiKPbZwclgkPLofewKr_5HqsBVUXyG3yVVQ4KBrOLg",
  },
  openGraph: {
    siteName: site.name,
    locale: "en_GB",
    type: "website",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${dmSans.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
