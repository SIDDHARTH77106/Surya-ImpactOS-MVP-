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

// Browser tab title aur SEO yahan set kiya hai
export const metadata: Metadata = {
  title: "Surya ImpactOS | Dashboard",
  description: "Powering Learning. Sustaining Futures. Real-time monitoring for solar-powered smart institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}