import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Segurinite — Panel de Control",
  description: "Sistema de monitoreo IoT para seguridad escolar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={lato.variable}>
      <body className={lato.className}>{children}</body>
    </html>
  );
}