import { Activity, ChevronLeft, ChevronRight, Settings, Smile, Meh, Droplet, Plus, Edit3, Trash2, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { NutritionRings } from '../common/NutritionRings';
import { DailyLog, FoodItem, Settings as SettingsType } from '../../types';
import { formatDateReadable } from '../../utils/dateHelpers';

interface DashboardProps {
  viewDate: string;
  isToday: boolean;
  onDateChange: (days: number) => void;
  onOpenSettings: () => void;
  cycleDay: number;
  shotsCount: number;
  onOpenShot: () => void;
  onOpenTimeline: () => void;
  currentWeight: number;
  totalLost: string;
  onOpenWeight: () => void;
  dailyLog: DailyLog;
  onOpenSymptoms: () => void;
  settings: SettingsType;
  onWaterAdd: (amount: number) => void;
  onFoodQuickAdd: (name: string, calories: number, protein: number) => void;
  onOpenFood: () => void;
  logItems: FoodItem[];
  onDeleteFood: (id: string, calories: number, protein: number) => void;
  onOpenNotes: () => void;
}

export const Dashboard = ({
  viewDate,
  isToday,
  onDateChange,
  onOpenSettings,
  cycleDay,
  shotsCount,
  onOpenShot,
  onOpenTimeline,
  currentWeight,
  totalLost,
  onOpenWeight,
  dailyLog,
  onOpenSymptoms,
  settings,
  onWaterAdd,
  onFoodQuickAdd,
  onOpenFood,
  logItems,
  onDeleteFood,
  onOpenNotes
}: DashboardProps) => {
  return (
    <div className="space-y-8 pb-40">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center px-4 pt-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 p-1.5 shadow-premium">
            <button
              onClick={() => onDateChange(-1)}
              className="p-2.5 rounded-2xl hover:bg-white text-slate-400 hover:text-indigo-600 transition-premium"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 text-center min-w-[140px]">
              <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight">
                {isToday ? "Today" : formatDateReadable(viewDate).split(',')[0]}
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                {formatDateReadable(viewDate).split(',').slice(1).join(',')}
              </p>
            </div>
            <button
              onClick={() => onDateChange(1)}
              disabled={isToday}
              className={`p-2.5 rounded-2xl transition-premium ${isToday ? 'opacity-0 cursor-default' : 'hover:bg-white text-slate-400 hover:text-indigo-600'
                }`}
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="p-3.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] text-slate-600 hover:text-indigo-600 shadow-premium active:scale-90 transition-premium"
          aria-label="Open settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </motion.div>

      <div className="px-5 space-y-5">
        {/* Top Section: Status & Weight */}
        <div className="grid grid-cols-12 gap-5">
          <Card
            delay={0.1}
            className={`col-span-8 relative overflow-hidden cursor-pointer group ${(shotsCount > 0 && cycleDay <= 2)
              ? 'bg-indigo-600 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-[0_20px_40px_rgba(79,70,229,0.3)]'
              : 'glass-premium shadow-premium'
              }`}
            onClick={onOpenTimeline}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${(shotsCount > 0 && cycleDay <= 2) ? 'text-indigo-200' : 'text-indigo-500'}`} />
                <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${(shotsCount > 0 && cycleDay <= 2) ? 'text-indigo-100/70' : 'text-slate-400'}`}>
                  Dose Cycle
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenShot();
                }}
                className={`p-2 rounded-2xl transition-premium hover:scale-110 active:scale-90 ${(shotsCount > 0 && cycleDay <= 2) ? 'bg-white/20 text-white' : 'bg-white shadow-sm border border-slate-100 text-indigo-500'}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {shotsCount > 0 ? (
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <h2 className="text-5xl font-black leading-none tracking-tighter">{Math.max(0, 7 - cycleDay)}</h2>
                  <div className="flex flex-col mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-70 leading-none mb-1">Days To</span>
                    <span className="text-xs font-black leading-none">Next Shot</span>
                  </div>
                </div>

                <div className="flex gap-1.5 h-1.5 w-full">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-grow rounded-full transition-all duration-1000 ${i < cycleDay
                        ? (cycleDay <= 2 ? 'bg-white/40' : 'bg-indigo-200')
                        : (cycleDay <= 2 ? 'bg-white/10' : 'bg-slate-100/50')
                        } ${i === cycleDay ? 'animate-pulse' : ''}`}
                    />
                  ))}
                </div>

                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl w-fit ${(shotsCount > 0 && cycleDay <= 2) ? 'bg-white/20 text-indigo-50' : 'bg-indigo-50 text-indigo-600'}`}>
                  {cycleDay <= 2 ? (cycleDay === 0 && shotsCount > 0 ? 'Shot Logged' : 'Active Peak') : (7 - cycleDay <= 0 ? 'Log Today' : 'Maintenance')}
                </div>
              </div>
            ) : (
              <div className="py-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Start Your<br />Journey</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Log first injection</p>
              </div>
            )}
          </Card>

          <Card
            delay={0.15}
            className="col-span-4 flex flex-col items-center justify-center cursor-pointer glass-premium shadow-premium group"
            onClick={onOpenWeight}
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Weight</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{currentWeight}</span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">lb</span>
            </div>
            {parseFloat(totalLost) > 0 && (
              <div className="mt-3 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600">-{totalLost}</span>
              </div>
            )}
          </Card>
        </div>

        {/* Middle Section: Symptoms & Water */}
        <div className="grid grid-cols-2 gap-5">
          <Card
            delay={0.2}
            onClick={onOpenSymptoms}
            className="flex flex-col items-center justify-center gap-4 cursor-pointer glass-premium shadow-premium group"
          >
            <div className="relative">
              <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full transition-colors ${(!dailyLog.symptoms?.nausea && !dailyLog.symptoms?.fatigue) ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
              {(!dailyLog.symptoms?.nausea && !dailyLog.symptoms?.fatigue) ? (
                <Smile className="w-12 h-12 text-emerald-500 relative z-10 transition-premium group-hover:scale-110" />
              ) : (
                <Meh className="w-12 h-12 text-orange-500 relative z-10 transition-premium group-hover:scale-110" />
              )}
            </div>
            <div className="text-center">
              <div className="text-sm font-black text-slate-800 tracking-tight">Symptoms</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Check In</div>
            </div>
          </Card>

          <Card
            delay={0.25}
            className="flex flex-col justify-between relative overflow-hidden glass-premium shadow-premium group"
          >
            <div className="flex justify-between items-center z-10">
              <div className="p-3 bg-blue-50 rounded-[1.2rem] border border-blue-100">
                <Droplet className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-800 leading-none tracking-tighter">{dailyLog.water}</span>
                <span className="text-[10px] text-slate-400 font-black ml-1 uppercase tracking-widest">oz</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onWaterAdd(8);
              }}
              className="mt-6 py-3 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] z-10 active:scale-95 shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition-premium hover:bg-blue-600"
            >
              + Add 8 oz
            </button>

            <motion.div
              layout
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, (dailyLog.water / settings.waterGoal) * 100)}%` }}
              className="absolute bottom-0 left-0 w-full bg-blue-500/10 transition-all duration-1000 ease-out"
            />
          </Card>
        </div>

        {/* Nutrition Section */}
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Fuel Engine</h3>
            <div className="h-px flex-grow mx-6 bg-slate-200/50"></div>
            <Target className="w-4 h-4 text-slate-300" />
          </div>

          <Card delay={0.3} className="glass-premium shadow-premium">
            <div className="flex flex-col items-center text-center gap-8 lg:flex-row lg:text-left lg:justify-between">
              <NutritionRings
                calories={dailyLog.calories}
                calorieGoal={settings.calorieGoal}
                protein={dailyLog.protein}
                proteinGoal={settings.proteinGoal}
              />
              <div className="space-y-6 flex-grow max-w-xs">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Calories</span>
                    <span className="text-slate-900">{Math.round(dailyLog.calories)} / {settings.calorieGoal}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (dailyLog.calories / settings.calorieGoal) * 100)}%` }}
                      className="h-full bg-slate-800 rounded-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Protein</span>
                    <span className="text-emerald-600">{Math.round(dailyLog.protein)}g / {settings.proteinGoal}g</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (dailyLog.protein / settings.proteinGoal) * 100)}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => onFoodQuickAdd("Protein Shake", 160, 30)}
                className="flex-shrink-0 flex items-center gap-4 bg-white/60 border border-white rounded-[1.5rem] px-6 py-4 shadow-sm active:scale-95 transition-premium hover:bg-white"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]"></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black text-slate-800">Shake</span>
                  <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">30g P</span>
                </div>
              </button>
              <button
                onClick={() => onFoodQuickAdd("Greek Yogurt", 100, 15)}
                className="flex-shrink-0 flex items-center gap-4 bg-white/60 border border-white rounded-[1.5rem] px-6 py-4 shadow-sm active:scale-95 transition-premium hover:bg-white"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-black text-slate-800">Yogurt</span>
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">15g P</span>
                </div>
              </button>
              <button
                onClick={onOpenFood}
                className="flex-shrink-0 w-14 h-14 rounded-[1.4rem] bg-slate-900 shadow-xl text-white flex items-center justify-center active:scale-90 transition-premium hover:bg-indigo-600"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {logItems.length > 0 && (
                <div className="bg-slate-50/50 rounded-[2rem] p-3 space-y-2">
                  {logItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group transition-premium hover:shadow-md">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">{item.name}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.calories} kcal</span>
                          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">+{item.protein}g Protein</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteFood(item.id, item.calories, item.protein)}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-premium"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Journal Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onClick={onOpenNotes}
          className="relative p-10 glass-premium rounded-[3rem] border border-white shadow-premium cursor-pointer group overflow-hidden"
        >
          {/* Paper Texture/Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }}></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                <Edit3 className="w-4 h-4" /> Daily Journal
              </h3>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>

            <p className={`text-xl font-medium tracking-tight leading-relaxed italic ${dailyLog.notes ? 'text-slate-800' : 'text-slate-400 opacity-60'}`}>
              {dailyLog.notes || "Today is a new chapter in your journey. Tap to record your reflection..."}
            </p>

            {dailyLog.notes && (
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3 h-3" /> Updated {formatDateReadable(viewDate).split(',')[0]}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
