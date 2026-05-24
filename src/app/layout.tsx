import type { Metadata } from "next";
import { Poppins, Pacifico } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { MetaPixel } from "@/components/MetaPixel";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Fajas postquirúrgicas para mascotas. Comodidad y protección durante la recuperación de tu gato o perro. Medellín, Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fajicat — Comodidad para tu mascota",
  description: DESCRIPTION,
  keywords: [
    "faja postquirúrgica",
    "faja para gato",
    "faja para perro",
    "mascotas",
    "recuperación quirúrgica",
    "Medellín",
    "Colombia",
    "Fajicat",
  ],
  openGraph: {
    title: "Fajicat — Comodidad para tu mascota",
    description: DESCRIPTION,
    type: "website",
    locale: "es_CO",
    siteName: "Fajicat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fajicat — Comodidad para tu mascota",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <Analytics />
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  );
}
