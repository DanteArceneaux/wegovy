import 'react';
import { X } from 'lucide-react';
import { SYMPTOM_TYPES, SYMPTOM_LEVELS } from '../../constants';
import { Symptoms } from '../../types';

interface SymptomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempSymptoms: Symptoms;
  onSymptomsChange: (symptoms: Symptoms) => void;
  onSave: () => void;
  saving: boolean;
}

export const SymptomsModal = ({ isOpen, onClose, tempSymptoms, onSymptomsChange, onSave, saving }: SymptomsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Daily Check-in</h2>
          <button 
            onClick={onClose}
            aria-label="Close symptoms modal"
            disabled={saving}
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div className="space-y-6">
          {SYMPTOM_TYPES.map(sym => {
            const key = sym.toLowerCase() as keyof Symptoms;
            const level = tempSymptoms[key] || 0;
            return (
              <div key={sym}>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-slate-700">{sym}</label>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    {SYMPTOM_LEVELS[level as keyof typeof SYMPTOM_LEVELS]}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(levelNum => (
                    <button
                      key={levelNum}
                      onClick={() => onSymptomsChange({ ...tempSymptoms, [key]: levelNum })}
                      disabled={saving}
                      className={`flex-1 h-10 rounded-xl transition-all ${
                        level === levelNum
                          ? levelNum === 0
                            ? 'bg-slate-200 text-slate-600'
                            : levelNum === 1
                            ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
                            : levelNum === 2
                            ? 'bg-orange-100 text-orange-600 border border-orange-200'
                            : 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {levelNum}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Check-in'}
        </button>
      </div>
    </div>
  );
};


