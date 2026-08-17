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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Nexo Constructora | Precisión que permanece",
  description: "Planificación, construcción y supervisión de proyectos residenciales, corporativos e industriales en Honduras.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Nexo Constructora | Precisión que permanece",
    description: "Procesos claros, ejecución rigurosa y obras pensadas para permanecer.",
    type: "website",
    locale: "es_HN",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Nexo Constructora, precisión que permanece" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexo Constructora | Precisión que permanece",
    description: "Procesos claros, ejecución rigurosa y obras pensadas para permanecer.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
