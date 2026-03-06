import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

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
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
