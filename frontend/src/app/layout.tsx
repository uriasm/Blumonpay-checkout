import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Blumonpay dashboard",
  description: "Fullstack payment solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar global */}
          <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
            <h1 className="text-2xl font-bold">Blumonpay</h1>
            <nav className="space-y-3">
              <Link href="/" className="block hover:text-blue-300">
                Dashboard
              </Link>
              <Link href="/checkout" className="block hover:text-blue-300">
                Nueva transacción
              </Link>
            </nav>
          </aside>

          <main className="flex-1 p-10 bg-gray-100">{children}</main>
        </div>
      </body>
    </html>
  );
}
