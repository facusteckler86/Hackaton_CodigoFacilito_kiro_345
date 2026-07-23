"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">
        Tiempo de Trabajo
      </Link>
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
    </nav>
  );
}
