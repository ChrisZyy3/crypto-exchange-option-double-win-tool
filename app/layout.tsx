import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dual Option Desk",
  description: "BTC & ETH dual-currency style option ordering",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-grid">
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
          {children}
        </main>
      </body>
    </html>
  );
}
