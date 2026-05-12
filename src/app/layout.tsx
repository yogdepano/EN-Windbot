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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
