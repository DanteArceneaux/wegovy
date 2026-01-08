import 'react';
import { X } from 'lucide-react';
import { Settings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formSettings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onSave: () => void;
  saving: boolean;
}

export const SettingsModal = ({ isOpen, onClose, formSettings, onSettingsChange, onSave, saving }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 p-6 animate-in slide-in-from-right overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Profile & Goals</h2>
        <button 
          onClick={onClose}
          aria-label="Close settings modal"
          disabled={saving}
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Body Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400">Height (Ft)</label>
              <input
                type="number"
                value={formSettings.heightFt}
                onChange={e => onSettingsChange({ ...formSettings, heightFt: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400">Height (In)</label>
              <input
                type="number"
                value={formSettings.heightIn}
                onChange={e => onSettingsChange({ ...formSettings, heightIn: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400">Start Weight</label>
              <input
                type="number"
                value={formSettings.startWeight}
                onChange={e => onSettingsChange({ ...formSettings, startWeight: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400">Goal Weight</label>
              <input
                type="number"
                value={formSettings.goalWeight}
                onChange={e => onSettingsChange({ ...formSettings, goalWeight: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Daily Goals</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400">Calories</label>
              <input
                type="number"
                value={formSettings.calorieGoal}
                onChange={e => onSettingsChange({ ...formSettings, calorieGoal: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400">Protein (g)</label>
              <input
                type="number"
                value={formSettings.proteinGoal}
                onChange={e => onSettingsChange({ ...formSettings, proteinGoal: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400">Water (oz)</label>
              <input
                type="number"
                value={formSettings.waterGoal}
                onChange={e => onSettingsChange({ ...formSettings, waterGoal: Number(e.target.value) })}
                className="w-full bg-slate-50 p-3 rounded-xl font-bold mt-1"
                disabled={saving}
              />
            </div>
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
};

