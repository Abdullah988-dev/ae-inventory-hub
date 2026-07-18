import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "AE-Inventory-Hub",
  description: "Electronics ERP & Inventory Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${jakarta.variable}`}>
      <body className={`${jakarta.className} min-h-screen bg-slate-950 antialiased`}>
        {children}
<Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}