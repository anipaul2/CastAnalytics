import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSession } from "~/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cast Analytics",
  description: "Discover your top 5 most engaged Farcaster casts",
  openGraph: {
    title: "Cast Analytics",
    description: "Discover your top 5 most engaged Farcaster casts",
    images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center",
      button: {
        title: "Cast Analytics",
        action: "post",
      },
      postUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/share`,
    }),
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop&crop=center",
      button: {
        title: "Cast Analytics",
        action: "post",
      },
      postUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/share`,
    }),
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
      </head>
      <body className={inter.className}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
