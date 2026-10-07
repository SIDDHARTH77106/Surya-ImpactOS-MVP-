import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
