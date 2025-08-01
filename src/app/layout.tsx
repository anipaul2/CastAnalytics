import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Castlytics - Your Top Engaged Casts",
  description: "See which casts hit different. Track your bangers and level up your Farcaster game.",
  openGraph: {
    title: "Castlytics",
    description: "Your top casts, ranked",
    type: "website",
    url: "https://cast-analytics.vercel.app",
    images: [
      {
        url: "https://raw.githubusercontent.com/anipaul2/imageUpload/main/SI.png",
        width: 1200,
        height: 630,
        alt: "Castlytics - Track your top performing casts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Castlytics",
    description: "Your top casts, ranked",
    images: ["https://raw.githubusercontent.com/anipaul2/imageUpload/main/SI.png"],
  },
  other: {
    "farcaster:app": "castlytics",
    "fc:frame": "vNext",
    "fc:frame:image": "https://raw.githubusercontent.com/anipaul2/imageUpload/main/SI.png",
    "fc:frame:button:1": "Launch Mini App",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": "https://cast-analytics.vercel.app",
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
