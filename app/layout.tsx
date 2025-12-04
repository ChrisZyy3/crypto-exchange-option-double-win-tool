import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Option Double Win Tool',
  description: 'BTC/ETH option screening for dual investment strategies.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <h1>Crypto Option Double Win</h1>
            <p className="subtitle">Screen BTC/ETH options by direction and term</p>
          </header>
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
