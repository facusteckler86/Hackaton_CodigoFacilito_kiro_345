import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DayRecord, WeeklyRecord } from "@/types";

// Usamos un solo documento por usuario (por ahora "default" sin auth)
const USER_ID = "default";
const COLLECTION = "timeTracker";

export interface TimeTrackerData {
  weeklyGoal: number;
  dailyGoal: number;
  workDays: string[];
  days: DayRecord[];
  history: WeeklyRecord[];
  currentWeekStart: string;
}

/**
 * Guarda los datos del tracker en Firestore.
 */
export async function saveTrackerData(data: TimeTrackerData): Promise<void> {
  const ref = doc(db, COLLECTION, USER_ID);
  await setDoc(ref, data);
}

/**
 * Carga los datos del tracker desde Firestore.
 * Retorna null si no existe el documento.
 */
export async function loadTrackerData(): Promise<TimeTrackerData | null> {
  const ref = doc(db, COLLECTION, USER_ID);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as TimeTrackerData;
}
