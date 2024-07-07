import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import RTKProvider from "@/context/RTKProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo - CodexHaroon App",
  description:
    "Todo App using Next.js, Shadcn, React Hook Form, Zod and Redux Toolkit With Custom Bcrypt and JWT Auth - Powered by Code x Haroon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RTKProvider>
          {children}
          <Toaster />
        </RTKProvider>
      </body>
    </html>
  );
}
