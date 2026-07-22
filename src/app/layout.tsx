import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Analytics from "@/components/Analytics";
import GTMClickTracker from "@/components/GTMClickTracker";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
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
  description:
    "Stop receiving 'Ineligible' ratings. ResumeGov validates your federal resume against OPM 2-page rule, GS-level requirements, and vacancy-specific language.",
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
      <body className="min-h-full flex flex-col">
        <Analytics />
        <GTMClickTracker />
        {children}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
