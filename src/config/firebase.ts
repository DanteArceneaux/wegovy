import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Environment variables from Vite (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if any keys are missing to determine Demo Mode
export const isDemoMode = !firebaseConfig.apiKey ||
  firebaseConfig.apiKey.includes('YOUR_') ||
  firebaseConfig.apiKey.includes('demo');

const app = !getApps().length ? initializeApp(isDemoMode ? {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
} : firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

// For development multi-tenancy support if needed
export const appId = import.meta.env.VITE_APP_ID || 'default-app-id';

// Single User Mode: Data is permanent across devices without individual accounts
export const GLOBAL_USER_ID = 'primary_user_dante';

export { auth, db };

