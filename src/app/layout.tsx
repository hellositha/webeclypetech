import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ECLYPE Technology | Integrated IT Solutions & Services Provider',
  description:
    'Delivering reliable, secure, scalable, and cost-effective IT solutions tailored to your business needs. Enterprise IT Infrastructure, Cloud, Biometric HRM, ERP, CCTV, and Zero-Trust Cybersecurity.',
  keywords: [
    'IT Solutions Provider',
    'Enterprise IT Infrastructure',
    'Cloud and Managed IT Services',
    'HRM Software',
    'ERP Software',
    'CCTV Physical Security',
    'Data Center Solutions',
    'IT Security and Network Solutions',
    'ECLYPE Technology',
    'eclypetech.biz',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
