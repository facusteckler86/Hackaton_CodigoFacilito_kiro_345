"use client";

import HistoryView from "@/components/HistoryView";

export default function HistorialPage() {
  return (
    <div className="py-4">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Historial de Semanas Cargadas: 
      </h1>
      <HistoryView />
    </div>
  );
}
