import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CalendarEvent } from "@/types";

const USER_ID = "default";
const COLLECTION = "calendarEvents";

/**
 * Guarda todos los eventos en Firestore.
 */
export async function saveEvents(events: CalendarEvent[]): Promise<void> {
  const ref = doc(db, COLLECTION, USER_ID);
  await setDoc(ref, { events });
}

/**
 * Carga todos los eventos desde Firestore.
 */
export async function loadEvents(): Promise<CalendarEvent[]> {
  const ref = doc(db, COLLECTION, USER_ID);
  const snap = await getDoc(ref);

  if (!snap.exists()) return [];

  const data = snap.data();
  return (data.events || []) as CalendarEvent[];
}
