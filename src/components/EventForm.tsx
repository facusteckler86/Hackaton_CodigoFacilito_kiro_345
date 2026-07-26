"use client";

import { useState } from "react";
import { getDayName } from "@/utils/dateUtils";

interface EventFormProps {
  selectedDate: string;
  onSave: (title: string, date: string, time: string) => void;
}

// Generar opciones de hora en intervalos de 30 minutos (00:00 a 23:30)
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export default function EventForm({ selectedDate, onSave }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState("09:00");

  // Actualizar fecha cuando cambia la seleccion del calendario
  if (selectedDate !== date && title === "") {
    setDate(selectedDate);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;
    onSave(title.trim(), date, time);
    setTitle("");
  };

  // Obtener nombre del dia a partir de la fecha seleccionada
  const dayName = date ? getDayName(new Date(date + "T00:00:00")) : "";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Nuevo Evento
      </h3>

      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        Titulo del evento o tarea
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Reunion con equipo"
        className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 dark:text-white text-sm"
        required
      />

      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        Fecha
      </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 dark:text-white text-sm"
        required
      />

      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
        Hora
      </label>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 dark:text-white text-sm"
        required
      >
        {TIME_SLOTS.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {date && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 capitalize">
          Dia: {dayName} - Hora: {time}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Guardar Evento
      </button>
    </form>
  );
}
