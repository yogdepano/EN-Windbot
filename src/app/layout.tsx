import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Every Nation | Rewards Tracker",
  description: "Official rewards tracking system for the Every Nation guild in Where Winds Meet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Re-rendering v1.0.8
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
