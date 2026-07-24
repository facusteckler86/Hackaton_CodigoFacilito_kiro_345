"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { DayRecord, WeeklyRecord } from "@/types";
import { getCurrentWeekDays, getWeekStartDate, calculateWorkedHours } from "@/utils/dateUtils";
import { saveTrackerData, loadTrackerData } from "@/services/timeservices";

interface TimeTrackerContextType {
  weeklyGoal: number;
  dailyGoal: number;
  workDays: string[];
  days: DayRecord[];
  totalHoursThisWeek: number;
  history: WeeklyRecord[];
  setWeeklyGoal: (hours: number) => void;
  setDailyGoal: (hours: number) => void;
  setWorkDays: (days: string[]) => void;
  updateDayHours: (date: string, hours: number) => void;
  updateDayTimes: (date: string, checkIn: string, checkOut: string) => void;
  resetWeek: () => void;
}

const TimeTrackerContext = createContext<TimeTrackerContextType | undefined>(undefined);

const STORAGE_KEY = "time-tracker-data";

interface StoredData {
  weeklyGoal: number;
  dailyGoal: number;
  workDays: string[];
  days: DayRecord[];
  history: WeeklyRecord[];
  currentWeekStart: string;
}

export function TimeTrackerProvider({ children }: { children: React.ReactNode }) {
  const [weeklyGoal, setWeeklyGoalState] = useState(40);
  const [dailyGoal, setDailyGoalState] = useState(8);
  const [workDays, setWorkDaysState] = useState<string[]>([
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
  ]);
  const [days, setDays] = useState<DayRecord[]>(getCurrentWeekDays());
  const [history, setHistory] = useState<WeeklyRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar datos: primero intenta Firestore, si falla usa localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const firestoreData = await loadTrackerData();
        if (firestoreData) {
          const currentWeekStart = getWeekStartDate(new Date());

          if (firestoreData.currentWeekStart && firestoreData.currentWeekStart !== currentWeekStart) {
            const previousWeek: WeeklyRecord = {
              weekStart: firestoreData.currentWeekStart,
              totalHours: firestoreData.days.reduce((acc, d) => acc + d.hoursWorked, 0),
              goal: firestoreData.weeklyGoal,
              days: firestoreData.days,
            };
            setHistory([previousWeek, ...firestoreData.history]);
            setDays(getCurrentWeekDays());
          } else {
            setDays(firestoreData.days);
            setHistory(firestoreData.history);
          }

          setWeeklyGoalState(firestoreData.weeklyGoal);
          setDailyGoalState(firestoreData.dailyGoal);
          setWorkDaysState(firestoreData.workDays);
          setIsLoaded(true);
          return;
        }
      } catch {
        // Si Firestore falla, intentar localStorage como fallback
      }

      // Fallback: localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const data: StoredData = JSON.parse(stored);
          const currentWeekStart = getWeekStartDate(new Date());

          if (data.currentWeekStart && data.currentWeekStart !== currentWeekStart) {
            const previousWeek: WeeklyRecord = {
              weekStart: data.currentWeekStart,
              totalHours: data.days.reduce((acc, d) => acc + d.hoursWorked, 0),
              goal: data.weeklyGoal,
              days: data.days,
            };
            setHistory([previousWeek, ...data.history]);
            setDays(getCurrentWeekDays());
          } else {
            setDays(data.days);
            setHistory(data.history);
          }

          setWeeklyGoalState(data.weeklyGoal);
          setDailyGoalState(data.dailyGoal);
          setWorkDaysState(data.workDays);
        } catch {
          // Si hay error en el parse, usar valores por defecto
        }
      }
      setIsLoaded(true);
    }

    loadData();
  }, []);

  // Guardar datos en localStorage y Firestore cuando cambien (con debounce)
  useEffect(() => {
    if (!isLoaded) return;

    const data: StoredData = {
      weeklyGoal,
      dailyGoal,
      workDays,
      days,
      history,
      currentWeekStart: getWeekStartDate(new Date()),
    };

    // Guardar inmediatamente en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Guardar en Firestore con debounce de 1.5s para no saturar
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveTrackerData(data).catch(() => {
        // Silenciar errores de red, localStorage ya tiene los datos
      });
    }, 1500);
  }, [weeklyGoal, dailyGoal, workDays, days, history, isLoaded]);

  const totalHoursThisWeek = days.reduce((acc, d) => acc + d.hoursWorked, 0);

  const updateDayHours = useCallback((date: string, hours: number) => {
    setDays((prev) =>
      prev.map((d) => (d.date === date ? { ...d, hoursWorked: hours } : d))
    );
  }, []);

  const updateDayTimes = useCallback((date: string, checkIn: string, checkOut: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.date === date
          ? { ...d, checkIn, checkOut, hoursWorked: calculateWorkedHours(checkIn, checkOut) }
          : d
      )
    );
  }, []);

  const setWeeklyGoal = useCallback((hours: number) => setWeeklyGoalState(hours), []);
  const setDailyGoal = useCallback((hours: number) => setDailyGoalState(hours), []);
  const setWorkDays = useCallback((newDays: string[]) => setWorkDaysState(newDays), []);

  const resetWeek = useCallback(() => {
    setDays(getCurrentWeekDays());
  }, []);

  return (
    <TimeTrackerContext.Provider
      value={{
        weeklyGoal,
        dailyGoal,
        workDays,
        days,
        totalHoursThisWeek,
        history,
        setWeeklyGoal,
        setDailyGoal,
        setWorkDays,
        updateDayHours,
        updateDayTimes,
        resetWeek,
      }}
    >
      {children}
    </TimeTrackerContext.Provider>
  );
}

export function useTimeTracker() {
  const context = useContext(TimeTrackerContext);
  if (!context) {
    throw new Error("useTimeTracker debe usarse dentro de un TimeTrackerProvider");
  }
  return context;
}
