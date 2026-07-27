"use client";

import { useState } from "react";
import { useTimeTracker } from "@/context/TimeTrackerContext";
import WeeklyProgress from "@/components/WeeklyProgress";
import DayCard from "@/components/DayCard";
import SettingsModal from "@/components/SettingsModal";

export default function Home() {
  const { days, workDays } = useTimeTracker();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // En desktop solo mostramos los días laborables configurados
  const filteredDays = days.filter((day) => workDays.includes(day.dayName));

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Dashboard Semanal</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          Configuracion
        </button>
      </div>

      <WeeklyProgress />

      <section>
        <h2 className="text-lg font-semibold mb-3 dark:text-white">Dias de la Semana</h2>

        {/* Mobile: sin cambios, como estaba */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {days.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>

        {/* Desktop: solo dias laborables, de a pares */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-3">
          {filteredDays.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      </section>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
