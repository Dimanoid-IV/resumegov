import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import Analytics from '@/components/Analytics';
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
  title: "ResumeGov — Federal Resume Compliance for USAJOBS",
  description: "Stop receiving 'Ineligible' ratings. ResumeGov validates your federal resume against OPM 2-page rule, GS-level requirements, and vacancy-specific language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WL9BDH49MY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WL9BDH49MY', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <Analytics />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
