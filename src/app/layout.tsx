import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { TimeTrackerProvider } from "@/context/TimeTrackerContext";

export const metadata: Metadata = {
  title: "Time Tracker - Control de Horas",
  description: "Aplicacion para gestionar y controlar horas de trabajo semanales y diarias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        <TimeTrackerProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto p-4">{children}</main>
        </TimeTrackerProvider>
      </body>
    </html>
  );
}
