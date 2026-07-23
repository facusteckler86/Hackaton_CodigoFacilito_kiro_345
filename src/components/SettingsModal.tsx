"use client";

import { useState } from "react";
import { useTimeTracker } from "@/context/TimeTrackerContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { weeklyGoal, dailyGoal, workDays, setWeeklyGoal, setDailyGoal, setWorkDays } =
    useTimeTracker();

  const [localWeekly, setLocalWeekly] = useState(weeklyGoal);
  const [localDaily, setLocalDaily] = useState(dailyGoal);
  const [localWorkDays, setLocalWorkDays] = useState<string[]>(workDays);

  const allDays = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  const toggleDay = (day: string) => {
    setLocalWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    setWeeklyGoal(localWeekly);
    setDailyGoal(localDaily);
    setWorkDays(localWorkDays);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-lg p-5 sm:p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Configuracion</h2>

        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Meta semanal (horas)</label>
        <input
          type="number"
          value={localWeekly}
          onChange={(e) => setLocalWeekly(Number(e.target.value))}
          className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 dark:text-white"
          min={0}
        />

        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Meta diaria (horas)</label>
        <input
          type="number"
          value={localDaily}
          onChange={(e) => setLocalDaily(Number(e.target.value))}
          className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 dark:text-white"
          min={0}
        />

        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Dias laborables</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {allDays.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                localWorkDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
