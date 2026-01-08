import { useState } from 'react';
import { X } from 'lucide-react';
import { INJECTION_SITES, DOSAGE_OPTIONS } from '../../constants';
import { getLocalTodayStr } from '../../utils/dateHelpers';
import { Shot } from '../../types';

interface ShotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shot: Omit<Shot, 'id'>) => Promise<void>;
  saving: boolean;
}

export const ShotModal = ({ isOpen, onClose, onSave, saving }: ShotModalProps) => {
  const [newShot, setNewShot] = useState({
    date: getLocalTodayStr(),
    time: '09:00',
    dosage: '0.25',
    site: 'Right Thigh',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    await onSave(newShot);
    setNewShot({
      date: getLocalTodayStr(),
      time: '09:00',
      dosage: '0.25',
      site: 'Right Thigh',
      notes: ''
    });
  };

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Log Injection</h2>
          <button
            onClick={onClose}
            aria-label="Close injection modal"
            disabled={saving}
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={newShot.date}
              onChange={e => setNewShot({ ...newShot, date: e.target.value })}
              className="bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
              disabled={saving}
            />
            <input
              type="time"
              value={newShot.time}
              onChange={e => setNewShot({ ...newShot, time: e.target.value })}
              className="bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
              disabled={saving}
            />
          </div>
          <select
            value={newShot.dosage}
            onChange={e => setNewShot({ ...newShot, dosage: e.target.value })}
            className="w-full bg-slate-50 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
            disabled={saving}
          >
            {DOSAGE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            {INJECTION_SITES.map(site => (
              <button
                key={site}
                onClick={() => setNewShot({ ...newShot, site })}
                disabled={saving}
                className={`p-3 text-sm font-bold rounded-xl transition-all ${newShot.site === site
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-slate-50 text-slate-500'
                  }`}
              >
                {site}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !newShot.date}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
};

