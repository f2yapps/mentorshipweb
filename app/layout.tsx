import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Mentorship Platform | Connect Mentors & Mentees Globally",
    template: "%s | Mentorship Platform",
  },
  description:
    "A global mentorship platform connecting volunteer mentors with mentees across Ethiopia, Africa, and the world. Get free advice and guidance in academics, career, life, and more.",
  keywords: [
    "mentorship",
    "mentor",
    "mentee",
    "Ethiopia",
    "Africa",
    "career",
    "academics",
    "volunteer",
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
