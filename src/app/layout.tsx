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
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <TimeTrackerProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4">{children}</main>
          <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            Realizado por{" "}
            <a
              href="https://www.linkedin.com/in/facundomsteckler/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              facusteckler86
            </a>
          </footer>
        </TimeTrackerProvider>
      </body>
    </html>
  );
}
