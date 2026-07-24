import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-hY81y56ehK-Ly4N4R0XswdGuXv8qchE",
  authDomain: "appteam345-b470b.firebaseapp.com",
  projectId: "appteam345-b470b",
  storageBucket: "appteam345-b470b.firebasestorage.app",
  messagingSenderId: "1037798307625",
  appId: "1:1037798307625:web:ea1945579b6867b4caa938",
};

// Evita inicializar múltiples veces en desarrollo (hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
