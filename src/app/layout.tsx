import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import './crm.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'CX CRM · 首頁儀表板',
  description: 'CX CRM Sales Cloud — 現代 B2B SaaS CRM 平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${outfit.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
