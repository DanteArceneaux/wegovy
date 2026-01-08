import { useState } from 'react';
import { X } from 'lucide-react';
import { formatDateReadable } from '../../utils/dateHelpers';
import { validateWeight } from '../../utils/validation';

interface WeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weight: number) => Promise<void>;
  viewDate: string;
  saving: boolean;
  error?: string;
}

export const WeightModal = ({ isOpen, onClose, onSave, viewDate, saving, error: externalError }: WeightModalProps) => {
  const [newWeight, setNewWeight] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    const validation = validateWeight(newWeight);
    if (!validation.valid) {
      setLocalError(validation.error || 'Invalid weight');
      return;
    }
    setLocalError(null);
    await onSave(parseFloat(newWeight));
    setNewWeight('');
  };

  const displayError = localError || externalError;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Log Weight</h2>
          <button
            onClick={onClose}
            aria-label="Close weight modal"
            disabled={saving}
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-center text-slate-400 mb-2">Logging for {formatDateReadable(viewDate)}</p>
        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {displayError}
          </div>
        )}
        <input
          type="number"
          placeholder="0.0 lbs"
          value={newWeight}
          onChange={e => setNewWeight(e.target.value)}
          autoFocus
          className="w-full text-5xl font-bold text-center py-8 border-b border-slate-100 focus:border-slate-900 outline-none text-slate-800 bg-transparent placeholder:text-slate-200"
          disabled={saving}
        />
        <button
          onClick={handleSave}
          disabled={saving || !newWeight}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Log'}
        </button>
      </div>
    </div>
  );
};

