import { useCallback } from 'react';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, appId, GLOBAL_USER_ID } from '../config/firebase';
import { Settings, Shot, FoodItem, Symptoms } from '../types';

export const useWegovyActions = () => {
  const uid = GLOBAL_USER_ID;

  const saveSettings = useCallback(async (settings: Settings) => {
    const settingsRef = doc(db, 'artifacts', appId, 'users', uid, 'settings', 'profile');
    await setDoc(settingsRef, settings, { merge: true });
  }, [uid]);

  const saveShot = useCallback(async (shot: Omit<Shot, 'id'> & { id?: string }) => {
    if (shot.id) {
      // Update existing
      const { id, ...data } = shot;
      await setDoc(doc(db, 'artifacts', appId, 'users', uid, 'shots', id), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } else {
      // Add new
      await addDoc(collection(db, 'artifacts', appId, 'users', uid, 'shots'), {
        ...shot,
        timestamp: serverTimestamp()
      });
    }
  }, [uid]);

  const deleteShot = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'users', uid, 'shots', id));
  }, [uid]);

  const saveFood = useCallback(async (viewDate: string, food: Omit<FoodItem, 'id' | 'dateString'>) => {
    const logRef = doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { calories: 0, protein: 0 };

    await Promise.all([
      addDoc(collection(db, 'artifacts', appId, 'users', uid, 'foodItems'), {
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
  }, [uid]);

  const updateWater = useCallback(async (viewDate: string, amount: number) => {
    const logRef = doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { water: 0 };

    await setDoc(logRef, {
      water: Math.max(0, (currentLog.water || 0) + amount)
    }, { merge: true });
  }, [uid]);

  const saveWeight = useCallback(async (viewDate: string, weight: number) => {
    await addDoc(collection(db, 'artifacts', appId, 'users', uid, 'weight'), {
      weight,
      date: viewDate,
      timestamp: serverTimestamp()
    });
  }, [uid]);

  const saveSymptoms = useCallback(async (viewDate: string, symptoms: Symptoms) => {
    await setDoc(
      doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate),
      { symptoms },
      { merge: true }
    );
  }, [uid]);

  const saveNotes = useCallback(async (viewDate: string, notes: string) => {
    await setDoc(
      doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate),
      { notes },
      { merge: true }
    );
  }, [uid]);

  const deleteFood = useCallback(async (viewDate: string, id: string, cals: number, prot: number) => {
    const logRef = doc(db, 'artifacts', appId, 'users', uid, 'dailyLogs', viewDate);
    const logSnap = await getDoc(logRef);
    const currentLog = logSnap.exists() ? logSnap.data() : { calories: 0, protein: 0 };

    await Promise.all([
      deleteDoc(doc(db, 'artifacts', appId, 'users', uid, 'foodItems', id)),
      setDoc(logRef, {
        calories: Math.max(0, (currentLog.calories || 0) - cals),
        protein: Math.max(0, (currentLog.protein || 0) - prot)
      }, { merge: true })
    ]);
  }, [uid]);

  const toggleGroceryItem = useCallback(async (boughtItems: Record<string, boolean>, item: string) => {
    const listRef = doc(db, 'artifacts', appId, 'users', uid, 'data', 'shoppingList');
    const newState = { ...boughtItems, [item]: !boughtItems[item] };
    await setDoc(listRef, newState, { merge: true });
  }, [uid]);

  const resetGroceryList = useCallback(async () => {
    const listRef = doc(db, 'artifacts', appId, 'users', uid, 'data', 'shoppingList');
    await setDoc(listRef, {});
  }, [uid]);

  return {
    saveSettings,
    saveShot,
    saveFood,
    updateWater,
    saveWeight,
    saveSymptoms,
    saveNotes,
    deleteFood,
    deleteShot,
    toggleGroceryItem,
    resetGroceryList
  };
};
