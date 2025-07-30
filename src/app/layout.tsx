import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Castlytics - Your Top Engaged Casts",
  description: "Discover which of your casts sparked the most engagement. Understand your audience's preferences and craft better content.",
  openGraph: {
    title: "Castlytics - Your Top Engaged Casts",
    description: "Discover which of your casts sparked the most engagement. Understand your audience's preferences and craft better content.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Castlytics - Your Top Engaged Casts",
    description: "Discover which of your casts sparked the most engagement. Understand your audience's preferences and craft better content.",
  },
  other: {
    "farcaster:app": "castlytics",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="farcaster:app" content="castlytics" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
