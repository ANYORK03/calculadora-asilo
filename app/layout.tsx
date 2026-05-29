import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora de Asilo USA | Fechas y Tarifas",
  description:
    "Calcula tu tarifa AAF, permiso de trabajo y elegibilidad para E-Request basado en tu caso de asilo en Estados Unidos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
