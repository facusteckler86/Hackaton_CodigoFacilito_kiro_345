"use client";

import { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 text-white px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold">
          Tiempo de Trabajo
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
          <ul className="flex gap-4 text-sm">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/historial" className="hover:text-blue-400 transition-colors">
                Historial
              </Link>
            </li>
          </ul>
          <DarkModeToggle />
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            className="p-1 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <ul className="sm:hidden mt-3 flex flex-col gap-2 text-sm border-t border-gray-700 pt-3">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/historial" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-blue-400 transition-colors">
              Historial
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
