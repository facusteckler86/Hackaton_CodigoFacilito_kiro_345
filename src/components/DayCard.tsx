"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTimeTracker } from "@/context/TimeTrackerContext";
import type { DayRecord } from "@/types";
import { calculateWorkedHours, formatHoursToReadable } from "@/utils/dateUtils";

interface DayCardProps {
  day: DayRecord;
}

export default function DayCard({ day }: DayCardProps) {
  const { updateDayTimes, dailyGoal } = useTimeTracker();
  const [localCheckIn, setLocalCheckIn] = useState(day.checkIn || "");
  const [localCheckOut, setLocalCheckOut] = useState(day.checkOut || "");
  const [saved, setSaved] = useState(true);

  // Calculamos las horas trabajadas en base a la entrada y salida guardadas en el día
  const hoursWorked = calculateWorkedHours(day.checkIn || "", day.checkOut || "");
  const percentage = dailyGoal > 0 ? Math.min((hoursWorked / dailyGoal) * 100, 100) : 0;
  
  const isCompleted = hoursWorked >= dailyGoal;
  const difference = Number((hoursWorked - dailyGoal).toFixed(2));

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCheckIn(e.target.value);
    setSaved(false);
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCheckOut(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    updateDayTimes(day.date, localCheckIn, localCheckOut);
    setSaved(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-3 cursor-pointer"
    >
      {/* Cabecera del día */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm capitalize text-gray-700 dark:text-gray-200">{day.dayName}</h3>
      </div>

      {/* Total de horas trabajadas en formato legible */}
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatHoursToReadable(hoursWorked)}</p>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Inputs de Entrada y Salida + Botón Guardar */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Entrada</label>
            <input 
              type="time" 
              step="1"
              value={localCheckIn} 
              onChange={handleCheckInChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-1.5 text-sm rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Salida</label>
            <input 
              type="time" 
              step="1"
              value={localCheckOut} 
              onChange={handleCheckOutChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-1.5 text-sm rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            saved
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saved ? "Guardado" : "Guardar"}
        </button>
      </div>

      {/* Mensaje de estado de cumplimiento del horario*/}
      {day.checkIn && day.checkOut && (
        <div className="mt-1 text-xs">
          {isCompleted ? (
            <span className="inline-block w-full text-center py-1 font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded">
              ¡Objetivo cumplido! {difference > 0 ? `(+${formatHoursToReadable(difference)})` : ""}
            </span>
          ) : (
            <span className="inline-block w-full text-center py-1 font-semibold text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 rounded">
              MMMMM te Falta {formatHoursToReadable(dailyGoal - hoursWorked)}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
