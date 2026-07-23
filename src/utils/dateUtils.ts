import type { DayRecord } from "@/types";

const DAY_NAMES = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

/**
 * Obtiene la fecha del lunes de la semana actual en formato YYYY-MM-DD.
 */
export function getWeekStartDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day; // lunes como inicio de semana
  d.setDate(d.getDate() + diff);
  return formatDate(d);
}

/**
 * Aca genero  los 7 días de la semana actual como DayRecord[].
 */
export function getCurrentWeekDays(): DayRecord[] {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(today.getDate() + diff);

  const days: DayRecord[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push({
      date: formatDate(current),
      dayName: DAY_NAMES[current.getDay()],
      hoursWorked: 0,
      checkIn: "",
      checkOut: "",
    });
  }
  return days;
}

/**
 * Formatea una fecha como YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha string YYYY-MM-DD a un formato legible (ej: "21 jul 2026").
 */
export function formatReadableDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[month - 1]} ${year}`;
}

/**
 * Obtiene el nombre del día en español a partir de una fecha.
 */
export function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

/**
 * Calcula las horas trabajadas en formato decimal a partir de la hora de entrada y salida ("08:25" y "16:00").
 */
export function calculateWorkedHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;

  const [inHours, inMinutes] = checkIn.split(":").map(Number);
  const [outHours, outMinutes] = checkOut.split(":").map(Number);

  const totalInMinutes = inHours * 60 + inMinutes;
  const totalOutMinutes = outHours * 60 + outMinutes;

  const diffMinutes = totalOutMinutes - totalInMinutes;
  
  if (diffMinutes <= 0) return 0;

  // Retorna horas en formato decimal (ej: 7.58)
  return Number((diffMinutes / 60).toFixed(2));
}

/**
 * Convierte horas decimales a un formato amigable (ej: 7.5 -> "7h 30m").
 */
export function formatHoursToReadable(decimalHours: number): string {
  if (!decimalHours || isNaN(decimalHours)) return "0h 0m";

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  return `${hours}h ${minutes}m`;
}
