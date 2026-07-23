"use client";

import { useTimeTracker } from "@/context/TimeTrackerContext";

export default function HistoryView() {
  const { history } = useTimeTracker();

  if (history.length === 0) {
    return (
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Historial</h2>
        <p className="text-gray-500 text-sm">No hay semanas anteriores registradas.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Historial de Semanas</h2>
      <div className="space-y-3">
        {history.map((week) => (
          <div
            key={week.weekStart}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="text-sm font-medium">Semana del {week.weekStart}</p>
              <p className="text-xs text-gray-500">{week.totalHours.toFixed(1)}h trabajadas</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Meta: {week.goal}h</p>
              <p
                className={`text-sm font-bold ${
                  week.totalHours >= week.goal ? "text-green-600" : "text-red-500"
                }`}
              >
                {week.totalHours >= week.goal ? "Cumplida" : "No cumplida"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
