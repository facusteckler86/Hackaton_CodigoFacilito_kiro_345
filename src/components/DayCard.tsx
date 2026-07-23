"use client";

import { useTimeTracker } from "@/context/TimeTrackerContext";
import type { DayRecord } from "@/types";

interface DayCardProps {
  day: DayRecord;
}

export default function DayCard({ day }: DayCardProps) {
  const { updateDayHours, dailyGoal } = useTimeTracker();
  const percentage = dailyGoal > 0 ? Math.min((day.hoursWorked / dailyGoal) * 100, 100) : 0;

  const handleAddHour = () => {
    updateDayHours(day.date, day.hoursWorked + 0.5);
  };

  const handleRemoveHour = () => {
    updateDayHours(day.date, Math.max(0, day.hoursWorked - 0.5));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <h3 className="font-medium text-sm capitalize">{day.dayName}</h3>
      <p className="text-2xl font-bold">{day.hoursWorked.toFixed(1)}h</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={handleRemoveHour}
          className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
        >
          -0.5h
        </button>
        <button
          onClick={handleAddHour}
          className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors"
        >
          +0.5h
        </button>
      </div>
    </div>
  );
}
