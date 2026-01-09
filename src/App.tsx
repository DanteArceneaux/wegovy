import { useState, useMemo, useCallback, useEffect } from 'react';
import { Activity, PieChart, ShoppingBag } from 'lucide-react';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useUserData, useDailyLog } from './hooks/useUserData';
import { useWegovyActions } from './hooks/useWegovyActions';
import { Dashboard } from './components/views/Dashboard';
import { AnalysisView } from './components/views/AnalysisView';
import { RecipesView } from './components/views/RecipesView';
import { InjectionTimeline } from './components/views/InjectionTimeline';

import { ShotModal } from './components/modals/ShotModal';
import { FoodModal } from './components/modals/FoodModal';
import { WeightModal } from './components/modals/WeightModal';
import { SymptomsModal } from './components/modals/SymptomsModal';
import { NotesModal } from './components/modals/NotesModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RecipeModal } from './components/modals/RecipeModal';
import { ReportModal } from './components/modals/ReportModal';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorToast } from './components/common/ErrorToast';
import { getLocalTodayStr, changeDateByDays } from './utils/dateHelpers';
import { calculateBMI, getCycleDayForDate } from './utils/calculations';
import { validateShot } from './utils/validation';
import { DEFAULT_SETTINGS } from './constants';
import { Settings, Recipe, Shot } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { isDemoMode } from './config/firebase';



export default function App() {
  const { user, loading: authLoading, error: authError } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'recipes'>('dashboard');
  const [viewDate, setViewDate] = useState(getLocalTodayStr());

  const { settings, shots, weightLog, boughtItems, error: dataError } = useUserData();
  const { dailyLog, logItems, error: logError } = useDailyLog(viewDate);
  const actions = useWegovyActions();

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modals state
  const [modals, setModals] = useState({
    shot: false,
    food: false,
    weight: false,
    symptoms: false,
    settings: false,
    report: false,
    notes: false,
    timeline: false,
    recipe: null as Recipe | null,
    editingShot: null as Shot | null
  });


  // Local Form State for Settings and temp symptoms/notes
  const [formSettings, setFormSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tempSymptoms, setTempSymptoms] = useState({ nausea: 0, fatigue: 0, headache: 0 });
  const [tempNotes, setTempNotes] = useState('');

  // Sync formSettings when settings change
  useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  // Sync tempSymptoms and tempNotes when dailyLog changes
  useEffect(() => {
    if (dailyLog.symptoms) {
      setTempSymptoms({
        nausea: dailyLog.symptoms.nausea || 0,
        fatigue: dailyLog.symptoms.fatigue || 0,
        headache: dailyLog.symptoms.headache || 0
      });
    }
    setTempNotes(dailyLog.notes || '');
  }, [dailyLog]);

  // Memoized calculations
  const weightForDate = useMemo(() => {
    const entriesUpToDate = weightLog.filter(w => w.date <= viewDate);
    if (entriesUpToDate.length === 0) return settings.startWeight;
    // Entries are already sorted ASC in useUserData, so the last one is the latest as of viewDate
    return entriesUpToDate[entriesUpToDate.length - 1].weight;
  }, [weightLog, viewDate, settings.startWeight]);

  const currentWeight = useMemo(() => {
    return weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : settings.startWeight;
  }, [weightLog, settings.startWeight]);

  const totalLost = useMemo(() => {
    return (settings.startWeight - currentWeight).toFixed(1);
  }, [settings.startWeight, currentWeight]);

  const currentBMI = useMemo(() => {
    return calculateBMI(currentWeight, settings.heightFt, settings.heightIn);
  }, [currentWeight, settings.heightFt, settings.heightIn]);

  const cycleDay = useMemo(() => {
    return getCycleDayForDate(viewDate, shots);
  }, [viewDate, shots]);

  const isToday = useMemo(() => viewDate === getLocalTodayStr(), [viewDate]);

  // Error handling
  useEffect(() => {
    if (isDemoMode) return;
    if (authError || dataError || logError) {
      setError('An error occurred. Please try again.');
    }
  }, [authError, dataError, logError]);


  // Handlers
  const wrapAction = async (action: () => Promise<void>, errorMessage: string) => {
    setSaving(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setSaving(false);
    }
  };

  const changeDate = useCallback((days: number) => {
    setViewDate(changeDateByDays(viewDate, days));
  }, [viewDate]);

  const handleSaveSettings = () => wrapAction(async () => {
    await actions.saveSettings(formSettings);
    setModals(prev => ({ ...prev, settings: false }));
  }, 'Failed to save settings.');

  const handleSaveShot = (shot: any) => wrapAction(async () => {
    const validation = validateShot(shot.date, shot.time);
    if (!validation.valid) throw new Error(validation.error || 'Invalid shot data');
    await actions.saveShot(shot);
    setModals(prev => ({ ...prev, shot: false, editingShot: null }));
  }, 'Failed to save injection.');

  const handleDeleteShot = (id: string) => {
    if (window.confirm("Are you sure you want to delete this injection record?")) {
      wrapAction(async () => await actions.deleteShot(id), 'Failed to delete injection.');
    }
  };

  const handleSaveFood = (food: { name: string; calories: number; protein: number }) => wrapAction(async () => {
    await actions.saveFood(viewDate, food);
    setModals(prev => ({ ...prev, food: false }));
  }, 'Failed to save food item.');

  const handleQuickAddFood = (name: string, calories: number, protein: number) => wrapAction(async () => {
    await actions.saveFood(viewDate, { name, calories, protein });
  }, 'Failed to add food.');

  const handleSaveWeight = (weight: number) => wrapAction(async () => {
    await actions.saveWeight(viewDate, weight);
    setModals(prev => ({ ...prev, weight: false }));
  }, 'Failed to save weight.');

  const handleSaveSymptoms = () => wrapAction(async () => {
    await actions.saveSymptoms(viewDate, tempSymptoms);
    setModals(prev => ({ ...prev, symptoms: false }));
  }, 'Failed to save symptoms.');

  const handleSaveNotes = () => wrapAction(async () => {
    await actions.saveNotes(viewDate, tempNotes);
    setModals(prev => ({ ...prev, notes: false }));
  }, 'Failed to save notes.');

  const handleDeleteFood = (id: string, cals: number, prot: number) => wrapAction(async () => {
    await actions.deleteFood(viewDate, id, cals, prot);
  }, 'Failed to delete food item.');

  const handleToggleGrocery = (item: string) => wrapAction(async () => {
    await actions.toggleGroceryItem(boughtItems, item);
  }, 'Failed to update shopping list.');

  const handleResetGrocery = () => {
    if (window.confirm("Uncheck all items?")) {
      wrapAction(async () => await actions.resetGroceryList(), 'Failed to reset shopping list.');
    }
  };

  const openModal = useCallback((modal: keyof typeof modals, value?: any) => {
    setModals(prev => ({ ...prev, [modal]: value !== undefined ? value : true }));
    setError(null);
  }, []);

  const closeModal = useCallback((modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
    setError(null);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium animate-pulse">
        <div className="text-center">
          <div className="text-lg mb-2">Loading Companion...</div>
        </div>
      </div>
    );
  }

  if (authError && !user && !isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-xl font-bold text-slate-900 mb-4">Firebase Connection Error</div>
          <div className="text-sm text-slate-600 mb-4">
            {authError.message || 'Unable to connect to Firebase.'}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-transparent min-h-screen font-sans text-slate-900 selection:bg-indigo-100">
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      {saving && <LoadingSpinner message="Saving..." />}

      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 text-center flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Demo Mode: Data will not be saved permanently
        </motion.div>
      )}


      <main className="max-w-md mx-auto min-h-screen bg-transparent relative">
        <div className="h-full overflow-y-auto scrollbar-hide">
          {activeTab === 'dashboard' && (
            <Dashboard
              viewDate={viewDate}
              isToday={isToday}
              onDateChange={changeDate}
              onOpenSettings={() => openModal('settings')}
              cycleDay={cycleDay}
              shotsCount={shots.length}
              onOpenShot={() => openModal('shot')}
              onOpenTimeline={() => openModal('timeline')}
              currentWeight={weightForDate}
              totalLost={totalLost}
              onOpenWeight={() => openModal('weight')}
              dailyLog={dailyLog}
              onOpenSymptoms={() => openModal('symptoms')}
              settings={settings}
              onWaterAdd={(amount) => wrapAction(() => actions.updateWater(viewDate, amount), 'Failed to update water.')}
              onFoodQuickAdd={handleQuickAddFood}
              onOpenFood={() => openModal('food')}
              logItems={logItems}
              onDeleteFood={handleDeleteFood}
              onOpenNotes={() => openModal('notes')}
            />

          )}
          {activeTab === 'analytics' && (
            <AnalysisView
              settings={settings}
              totalLost={totalLost}
              weightLog={weightLog}
              onOpenReport={() => openModal('report')}
              shots={shots}
            />
          )}
          {activeTab === 'recipes' && (
            <RecipesView
              boughtItems={boughtItems}
              onToggleGroceryItem={handleToggleGrocery}
              onResetGroceryList={handleResetGrocery}
              onOpenRecipe={(recipe) => openModal('recipe', recipe)}
              onFoodQuickAdd={handleQuickAddFood}
            />
          )}
        </div>

        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(448px-2rem)] glass-dark rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-50 border border-white/10 shadow-2xl transition-premium">
          {(['dashboard', 'analytics', 'recipes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === tab ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'
                }`}
              aria-label={tab === 'recipes' ? 'Kitchen' : tab}
            >
              <div className={`p-2 rounded-2xl transition-all ${activeTab === tab ? 'bg-indigo-600/30' : ''}`}>
                {tab === 'dashboard' && <Activity className="w-5 h-5" />}
                {tab === 'analytics' && <PieChart className="w-5 h-5" />}
                {tab === 'recipes' && <ShoppingBag className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${activeTab === tab ? 'opacity-100' : 'opacity-60'}`}>
                {tab === 'recipes' ? 'Kitchen' : tab}
              </span>
            </button>
          ))}
        </nav>

        <ShotModal
          isOpen={modals.shot}
          onClose={() => setModals(prev => ({ ...prev, shot: false, editingShot: null }))}
          onSave={handleSaveShot}
          saving={saving}
          initialData={modals.editingShot}
        />

        <FoodModal
          isOpen={modals.food}
          onClose={() => closeModal('food')}
          onSave={handleSaveFood}
          saving={saving}
          error={error || undefined}
        />

        <WeightModal
          isOpen={modals.weight}
          onClose={() => closeModal('weight')}
          onSave={handleSaveWeight}
          viewDate={viewDate}
          saving={saving}
          error={error || undefined}
        />

        <SymptomsModal
          isOpen={modals.symptoms}
          onClose={() => closeModal('symptoms')}
          tempSymptoms={tempSymptoms}
          onSymptomsChange={setTempSymptoms}
          onSave={handleSaveSymptoms}
          saving={saving}
        />

        <NotesModal
          isOpen={modals.notes}
          onClose={() => closeModal('notes')}
          tempNotes={tempNotes}
          onNotesChange={setTempNotes}
          onSave={handleSaveNotes}
          saving={saving}
        />

        <SettingsModal
          isOpen={modals.settings}
          onClose={() => closeModal('settings')}
          formSettings={formSettings}
          onSettingsChange={setFormSettings}
          onSave={handleSaveSettings}
          saving={saving}
        />

        <RecipeModal
          recipe={modals.recipe}
          onClose={() => openModal('recipe', null)}
          onLogMeal={(r) => {
            handleQuickAddFood(r.title, r.calories, r.protein);
            openModal('recipe', null);
          }}
        />

        <ReportModal
          isOpen={modals.report}
          onClose={() => closeModal('report')}
          totalLost={totalLost}
          currentBMI={currentBMI}
          shots={shots}
          weightLog={weightLog}
        />

        <AnimatePresence>
          {modals.timeline && (
            <InjectionTimeline
              shots={shots}
              onClose={() => closeModal('timeline')}
              onEditShot={(shot) => setModals(prev => ({ ...prev, timeline: false, shot: true, editingShot: shot }))}
              onDeleteShot={handleDeleteShot}
            />
          )}
        </AnimatePresence>
      </main>
    </div>


  );
}

