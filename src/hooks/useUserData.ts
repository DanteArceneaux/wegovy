import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db, appId } from '../config/firebase';
import { Settings, Shot, WeightEntry, DailyLog, FoodItem } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export const useUserData = (user: User | null) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [shots, setShots] = useState<Shot[]>([]);
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([]);
  const [boughtItems, setBoughtItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Allow demo mode - if no user but in demo mode, use default settings
    const isDemoMode = typeof window !== 'undefined' && !(window as any).__firebase_config;
    if (!user) {
      if (isDemoMode) {
        // Already using defaults, no need to set up listeners
        return;
      }
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Settings listener
    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
    const unsubSettings = onSnapshot(
      settingsRef,
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snap.data() } as Settings);
        }
      },
      (err) => {
        console.error('Settings listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubSettings);

    // Shots listener
    const shotsQ = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'shots'),
      orderBy('timestamp', 'desc')
    );
    const unsubShots = onSnapshot(
      shotsQ,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Shot));
        data.sort((a, b) => {
          const dateA = new Date(a.date + 'T' + a.time).getTime();
          const dateB = new Date(b.date + 'T' + b.time).getTime();
          return dateB - dateA;
        });
        setShots(data);
      },
      (err) => {
        console.error('Shots listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubShots);

    // Weight listener
    const weightQ = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'weight'),
      orderBy('date', 'asc')
    );
    const unsubWeight = onSnapshot(
      weightQ,
      (snap) => {
        setWeightLog(snap.docs.map(d => ({ id: d.id, ...d.data() } as WeightEntry)));
      },
      (err) => {
        console.error('Weight listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubWeight);

    // Shopping list listener
    const listRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'shoppingList');
    const unsubList = onSnapshot(
      listRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setBoughtItems(docSnap.data() as Record<string, boolean>);
        }
      },
      (err) => {
        console.error('Shopping list listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubList);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [user]);
  
  // In demo mode without user, return defaults
  const isDemoMode = typeof window !== 'undefined' && !(window as any).__firebase_config;
  if (!user && isDemoMode) {
    return { settings: DEFAULT_SETTINGS, shots: [], weightLog: [], boughtItems: {}, error: null };
  }

  return { settings, shots, weightLog, boughtItems, error };
};

export const useDailyLog = (user: User | null, viewDate: string) => {
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    calories: 0,
    protein: 0,
    water: 0,
    symptoms: {},
    notes: ''
  });
  const [logItems, setLogItems] = useState<FoodItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Allow demo mode - if no user but in demo mode, use empty defaults
    const isDemoMode = typeof window !== 'undefined' && !(window as any).__firebase_config;
    if (!user) {
      if (isDemoMode) {
        // Already using defaults, no need to set up listeners
        return;
      }
      return;
    }

    const unsubscribers: (() => void)[] = [];

    // Daily log listener
    const logRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate);
    const unsubLog = onSnapshot(
      logRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDailyLog({
            ...data,
            symptoms: data.symptoms || {},
            notes: data.notes || ''
          } as DailyLog);
        } else {
          setDailyLog({ calories: 0, protein: 0, water: 0, symptoms: {}, notes: '' });
        }
      },
      (err) => {
        console.error('Daily log listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubLog);

    // Food items listener
    const itemsQ = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'foodItems'),
      where('dateString', '==', viewDate)
    );
    const unsubItems = onSnapshot(
      itemsQ,
      (snap) => {
        setLogItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as FoodItem)));
      },
      (err) => {
        console.error('Food items listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubItems);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [user, viewDate]);
  
  // In demo mode without user, return defaults
  const isDemoMode = typeof window !== 'undefined' && !(window as any).__firebase_config;
  if (!user && isDemoMode) {
    return { 
      dailyLog: { calories: 0, protein: 0, water: 0, symptoms: {}, notes: '' }, 
      logItems: [], 
      error: null 
    };
  }

  return { dailyLog, logItems, error };
};

