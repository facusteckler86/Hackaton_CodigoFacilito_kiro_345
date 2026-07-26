"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Calendar from "@/components/Calendar";
import EventForm from "@/components/EventForm";
import Toast from "@/components/Toast";
import { saveEvents, loadEvents } from "@/services/eventService";
import { getDayName, formatDate } from "@/utils/dateUtils";
import type { CalendarEvent } from "@/types";

export default function AgendaPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "",
    type: "success",
    visible: false,
  });

  // Cargar eventos al montar
  useEffect(() => {
    loadEvents()
      .then(setEvents)
      .catch(() => {
        // Fallback: intentar localStorage
        const stored = localStorage.getItem("calendar-events");
        if (stored) {
          try {
            setEvents(JSON.parse(stored));
          } catch {
            // Usar vacio
          }
        }
      });
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, visible: true });
  };

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleSaveEvent = async (title: string, date: string, time: string) => {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title,
      date,
      time,
      dayName: getDayName(new Date(date + "T00:00:00")),
      createdAt: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // Guardar en localStorage inmediatamente
    localStorage.setItem("calendar-events", JSON.stringify(updatedEvents));

    // Guardar en Firestore
    try {
      await saveEvents(updatedEvents);
      showToast("Evento guardado exitosamente", "success");
    } catch {
      showToast("Error al guardar en la nube, se guardo localmente", "error");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("calendar-events", JSON.stringify(updatedEvents));

    try {
      await saveEvents(updatedEvents);
      showToast("Evento eliminado", "success");
    } catch {
      showToast("Error al eliminar en la nube", "error");
    }
  };

  // Eventos del dia seleccionado
  const eventsForSelectedDate = events.filter((e) => e.date === selectedDate);

  return (
    <div className="py-4 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Agenda</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <Calendar
            events={events}
            onDayClick={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* Formulario */}
        <div>
          <EventForm selectedDate={selectedDate} onSave={handleSaveEvent} />
        </div>
      </div>

      {/* Eventos del dia seleccionado */}
      {eventsForSelectedDate.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-white">
            Eventos para el {selectedDate}
          </h3>
          <ul className="space-y-2">
            {eventsForSelectedDate.map((ev) => (
              <motion.li
                key={ev.id}
                whileHover={{ scale: 1.02, x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-between border dark:border-gray-700 rounded p-3 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{ev.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {ev.dayName} {ev.time ? `- ${ev.time}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-medium"
                  aria-label="Eliminar evento"
                >
                  Eliminar
                </button>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </div>
  );
}
