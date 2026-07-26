export interface DayRecord {
  date: string; // formato YYYY-MM-DD
  dayName: string; // dia de la semana
  hoursWorked: number;
  checkIn: string;
  checkOut: string;
}

export interface WeeklyRecord {
  weekStart: string; // se inicia con el lunes
  totalHours: number;
  goal: number;
  days: DayRecord[];
}

export interface WeeklyConfig {
  weeklyGoal: number;
  dailyGoal: number;
  workDays: string[]; // ej: ["lunes", "martes", "miercoles", "jueves", "viernes"]
}

export interface DayLog {
  checkIn: string;  
  checkOut: string; 
  hoursWorked: number; 
  status: "pending" | "completed" | "overtime";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:MM (intervalos de 30 min)
  dayName: string; // dia de la semana
  createdAt: string; // ISO timestamp
}
