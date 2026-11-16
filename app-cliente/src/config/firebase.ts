import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Expo inyecta las variables EXPO_PUBLIC_* (van al bundle: son públicas por diseño).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const CHAT_ID: string = process.env.EXPO_PUBLIC_CHAT_ID || 'demo-1';

// En teléfono físico NO sirve localhost: poné la IP LAN de la PC (ej. http://192.168.1.20:3000).
export const API_BASE: string = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';
