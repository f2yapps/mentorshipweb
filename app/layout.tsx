import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnvSetupPage } from "@/components/EnvSetupPage";
import { isSupabaseConfigured } from "@/lib/env";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Youth Mentorship Platform | AI, Tech & Career Development",
    template: "%s | Youth Mentorship",
  },
  description:
    "Global mentorship platform empowering youth in developing countries with free guidance in AI, machine learning, software development, data science, and career growth. Connect with expert mentors worldwide.",
  keywords: [
    "youth mentorship",
    "AI mentorship",
    "technology mentorship",
    "career development",
    "developing countries",
    "machine learning",
    "software development",
    "data science",
    "free mentorship",
    "volunteer mentors",
  ],
  openGraph: {
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isSupabaseConfigured()) {
    return (
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen flex flex-col font-sans">
          <EnvSetupPage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
