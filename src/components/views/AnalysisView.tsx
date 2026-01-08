import { Syringe, FileText, TrendingDown, Target, Activity } from 'lucide-react';
import { Card } from '../common/Card';
import { WeightChart } from '../common/WeightChart';
import { Shot, Settings } from '../../types';

interface AnalysisViewProps {
  settings: Settings;
  totalLost: string;
  weightLog: any[];
  onOpenReport: () => void;
  shots: Shot[];
}

export const AnalysisView = ({
  settings,
  totalLost,
  weightLog,
  onOpenReport,
  shots
}: AnalysisViewProps) => {
  const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : settings.startWeight;

  return (
    <div className="space-y-8 pb-32 animate-in slide-in-from-right-10 duration-700 ease-out">
      <div className="px-5 pt-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Your Clinical Journey</p>
        </div>
        <div className="bg-white/40 backdrop-blur-xl p-2 rounded-2xl border border-white/60 shadow-sm">
          <Activity className="w-5 h-5 text-indigo-500" />
        </div>
      </div>

      {/* Hero Stats */}
      <div className="px-5 grid grid-cols-2 gap-4">
        <div className="glass-premium p-6 rounded-[2rem] shadow-premium flex flex-col justify-between h-40">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{totalLost} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">lb</span></span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total Progress</p>
          </div>
        </div>
        <div className="glass-premium p-6 rounded-[2rem] shadow-premium flex flex-col justify-between h-40">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">{settings.goalWeight} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">lb</span></span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Goal Weight</p>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Card className="glass-premium shadow-premium p-8 overflow-hidden pointer-events-none">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Weight Trend</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">Last 30 Days</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-indigo-600 tracking-tighter">{currentWeight} lbs</span>
            </div>
          </div>
          <WeightChart data={weightLog} goal={settings.goalWeight} />
        </Card>
      </div>

      <div className="px-5">
        <button
          onClick={onOpenReport}
          className="w-full glass-dark text-white p-6 rounded-[2.5rem] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-premium group"
        >
          <FileText className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-[0.25em]">Export Clinical Report</span>
        </button>
      </div>

      <div className="px-6">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Dose Log</h3>
          <div className="h-px w-full bg-slate-200/50"></div>
        </div>

        <div className="space-y-4">
          {shots.length === 0 ? (
            <div className="text-center py-12 glass-premium rounded-[2.5rem] border-dashed border-2 border-slate-200">
              <p className="text-xs text-slate-300 font-medium italic">No injections logged yet.</p>
            </div>
          ) : (
            shots.map((shot, i) => (
              <div key={shot.id} className="glass-premium p-5 rounded-[2rem] border border-white/50 flex items-center justify-between shadow-sm transition-premium hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                    <Syringe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800 leading-tight">
                      {new Date(shot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {shot.site} • {shot.dosage} mg
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100/50 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 uppercase">
                  #{shots.length - i}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
