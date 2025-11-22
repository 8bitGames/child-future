import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "우아미 - 아이의 미래 진로 탐색",
  description: "아이의 성향과 성장을 기록해서 진로를 함께 탐색하는 AI 기반 진로 검사 서비스",
  manifest: "/manifest.json",
  icons: {
    icon: "/Icon.png",
    apple: "/Icon.png",
  },
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "우아미",
  },
  openGraph: {
    title: "우아미 - 아이의 미래 진로 탐색",
    description: "아이의 성향과 성장을 기록해서 진로를 함께 탐색하는 AI 기반 진로 검사 서비스",
    images: ["/opengraph.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "우아미 - 아이의 미래 진로 탐색",
    description: "아이의 성향과 성장을 기록해서 진로를 함께 탐색하는 AI 기반 진로 검사 서비스",
    images: ["/opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
