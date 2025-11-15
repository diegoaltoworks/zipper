import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zipper - Bulk File Download Demo",
  description: "Download multiple files and combine them into a ZIP archive. A modern TypeScript package by Diego Alto.",
  keywords: ["zip", "download", "bulk download", "file download", "typescript", "browser"],
  authors: [{ name: "Diego Alto", url: "https://diegoalto.works" }],
  creator: "Diego Alto",
  openGraph: {
    title: "Zipper - Bulk File Download Demo",
    description: "Download multiple files and combine them into a ZIP archive",
    url: "https://diegoaltoworks.github.io/zipper",
    siteName: "Zipper",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zipper - Bulk File Download Demo",
    description: "Download multiple files and combine them into a ZIP archive",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
