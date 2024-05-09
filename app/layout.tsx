import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/services/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spellbook",
  description: "Turn your notes into flashcards, study guides, quizzes, and more. Magically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <ClerkProvider>
      <SpeedInsights />
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
