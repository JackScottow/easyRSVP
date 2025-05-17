import type React from "react";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QRCodeClient } from "@/app/components/QRCodeClient";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import SupabaseSessionInit from "@/components/SupabaseSessionInit";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EasyRSVP - Simplify Event Planning & RSVPs",
  description: "Create events, collect RSVPs, and manage attendees all in one place. The easiest way to plan your next gathering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/cropperjs/dist/cropper.min.css" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", openSans.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SupabaseSessionInit />
          <Navbar />
          {children}
          <Footer />
          <QRCodeClient />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
