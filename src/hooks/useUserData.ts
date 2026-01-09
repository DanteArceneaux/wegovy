import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db, appId, GLOBAL_USER_ID, isDemoMode } from '../config/firebase';
import { Settings, Shot, WeightEntry, DailyLog, FoodItem } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

export const useUserData = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [shots, setShots] = useState<Shot[]>([]);
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([]);
  const [boughtItems, setBoughtItems] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isDemoMode) return;

    const unsubscribers: (() => void)[] = [];
    const uid = GLOBAL_USER_ID;

    // Settings listener
    const settingsRef = doc(db, 'artifacts', appId, 'users', uid, 'settings', 'profile');
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
      collection(db, 'artifacts', appId, 'users', uid, 'shots'),
      orderBy('date', 'desc')
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
      collection(db, 'artifacts', appId, 'users', uid, 'weight'),
      orderBy('date', 'asc')
    );
    const unsubWeight = onSnapshot(
      weightQ,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as WeightEntry));
        data.sort((a, b) => {
          const dateA = new Date(a.date + 'T00:00:00').getTime();
          const dateB = new Date(b.date + 'T00:00:00').getTime();
          if (dateA !== dateB) return dateA - dateB;

          const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : Date.now();
          const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : Date.now();
          return timeA - timeB;
        });
        setWeightLog(data);
      },
      (err) => {
        console.error('Weight listener error:', err);
        setError(err);
      }
    );
    unsubscribers.push(unsubWeight);

    // Shopping list listener
    const listRef = doc(db, 'artifacts', appId, 'users', uid, 'data', 'shoppingList');
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
  }, []);

  if (isDemoMode) {
    return { settings: DEFAULT_SETTINGS, shots: [], weightLog: [], boughtItems: {}, error: null };
  }

  return { settings, shots, weightLog, boughtItems, error };
};

export const useDailyLog = (viewDate: string) => {
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
    if (isDemoMode) return;

    const unsubscribers: (() => void)[] = [];
    const uid = GLOBAL_USER_ID;

    // Daily log listener
    const logRef = doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate);
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
      collection(db, 'artifacts', appId, 'users', uid, 'foodItems'),
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
  }, [viewDate]);

  if (isDemoMode) {
    return {
      dailyLog: { calories: 0, protein: 0, water: 0, symptoms: {}, notes: '' },
      logItems: [],
      error: null
    };
  }

  return { dailyLog, logItems, error };
};
