import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Segurinite — Panel de Control",
  description: "Sistema de monitoreo IoT para seguridad escolar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}