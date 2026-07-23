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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Configuracion</h2>

        <label className="block text-sm font-medium mb-1">Meta semanal (horas)</label>
        <input
          type="number"
          value={localWeekly}
          onChange={(e) => setLocalWeekly(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-3"
          min={0}
        />

        <label className="block text-sm font-medium mb-1">Meta diaria (horas)</label>
        <input
          type="number"
          value={localDaily}
          onChange={(e) => setLocalDaily(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-3"
          min={0}
        />

        <label className="block text-sm font-medium mb-2">Dias laborables</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {allDays.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                localWorkDays.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
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
