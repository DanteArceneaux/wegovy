import { useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, appId } from '../config/firebase';
import { Settings, Shot, FoodItem, Symptoms } from '../types';

export const useWegovyActions = (user: User | null) => {
  const saveSettings = useCallback(async (settings: Settings) => {
    if (!user) return;
    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
    await setDoc(settingsRef, settings, { merge: true });
  }, [user]);

  const saveShot = useCallback(async (shot: Omit<Shot, 'id'>) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'shots'), {
      ...shot,
      timestamp: serverTimestamp()
    });
  }, [user]);

  const saveFood = useCallback(async (viewDate: string, food: Omit<FoodItem, 'id' | 'dateString'>) => {
    if (!user) return;

    const logRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { calories: 0, protein: 0 };

    await Promise.all([
      addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'foodItems'), {
        ...food,
        dateString: viewDate,
        timestamp: serverTimestamp()
      }),
      setDoc(logRef, {
        calories: (currentLog.calories || 0) + food.calories,
        protein: (currentLog.protein || 0) + food.protein,
        water: currentLog.water || 0,
        symptoms: currentLog.symptoms || {},
        notes: currentLog.notes || ''
      }, { merge: true })
    ]);
  }, [user]);

  const updateWater = useCallback(async (viewDate: string, amount: number) => {
    if (!user) return;
    const logRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { water: 0 };

    await setDoc(logRef, {
      water: Math.max(0, (currentLog.water || 0) + amount)
    }, { merge: true });
  }, [user]);

  const saveWeight = useCallback(async (viewDate: string, weight: number) => {
    if (!user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'weight'), {
      weight,
      date: viewDate,
      timestamp: serverTimestamp()
    });
  }, [user]);

  const saveSymptoms = useCallback(async (viewDate: string, symptoms: Symptoms) => {
    if (!user) return;
    await setDoc(
      doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate),
      { symptoms },
      { merge: true }
    );
  }, [user]);

  const saveNotes = useCallback(async (viewDate: string, notes: string) => {
    if (!user) return;
    await setDoc(
      doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate),
      { notes },
      { merge: true }
    );
  }, [user]);

  const deleteFood = useCallback(async (viewDate: string, id: string, cals: number, prot: number) => {
    if (!user) return;
    const logRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { calories: 0, protein: 0 };

    await Promise.all([
      deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'foodItems', id)),
      setDoc(logRef, {
        calories: Math.max(0, (currentLog.calories || 0) - cals),
        protein: Math.max(0, (currentLog.protein || 0) - prot)
      }, { merge: true })
    ]);
  }, [user]);

  const toggleGroceryItem = useCallback(async (boughtItems: Record<string, boolean>, item: string) => {
    if (!user) return;
    const listRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'shoppingList');
    const newState = { ...boughtItems, [item]: !boughtItems[item] };
    await setDoc(listRef, newState, { merge: true });
  }, [user]);

  const resetGroceryList = useCallback(async () => {
    if (!user) return;
    const listRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'shoppingList');
    await setDoc(listRef, {});
  }, [user]);

  return {
    saveSettings,
    saveShot,
    saveFood,
    updateWater,
    saveWeight,
    saveSymptoms,
    saveNotes,
    deleteFood,
    toggleGroceryItem,
    resetGroceryList
  };
};
