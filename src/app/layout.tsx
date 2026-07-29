import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import BackgroundMusic from "@/components/BackgroundMusic";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ký ức số",
    template: "%s | Ký ức số",
  },
  description: "Thư viện ảnh và video cá nhân bằng tiếng Việt, tối ưu cho xem nhanh và quản lý gọn gàng.",
  applicationName: "Ký ức số",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Ký ức số",
    description: "Thư viện ảnh và video cá nhân bằng tiếng Việt.",
    siteName: "Ký ức số",
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground relative">
        <ThemeProvider>
          <BackgroundMusic />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
