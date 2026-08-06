import type { Metadata } from "next";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Page v3 - Teste Completo",
  description: "Rastreamento Meta Pixel + Supabase (v3 - Zero-Based)",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
