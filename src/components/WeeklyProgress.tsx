"use client";

import { useTimeTracker } from "@/context/TimeTrackerContext";

export default function WeeklyProgress() {
  const { weeklyGoal, totalHoursThisWeek } = useTimeTracker();
  const percentage = weeklyGoal > 0 ? Math.min((totalHoursThisWeek / weeklyGoal) * 100, 100) : 0;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-2 dark:text-white">Progreso Semanal</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {totalHoursThisWeek.toFixed(1)}h / {weeklyGoal}h
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4">
        <div
          className="bg-blue-600 h-3 sm:h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(0)}% Completado</p>
    </section>
  );
}
