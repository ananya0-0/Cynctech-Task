import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkSave - AI-Powered Link Saver",
  description: "Save URLs with AI-generated summaries, tags, and search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}