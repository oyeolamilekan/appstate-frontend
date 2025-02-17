import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Appstate - Sell access to you code.",
  description: "An easy way to sell your code without the hassle of complicated workflows. Focus on creating amazing product while we take care of the details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
