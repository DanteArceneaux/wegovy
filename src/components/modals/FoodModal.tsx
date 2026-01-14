import { useState } from 'react';
import { X } from 'lucide-react';
import { validateFoodEntry } from '../../utils/validation';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: { name: string; calories: number; protein: number }) => Promise<void>;
  saving: boolean;
  error?: string;
}

export const FoodModal = ({ isOpen, onClose, onSave, saving, error: externalError }: FoodModalProps) => {
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '' });
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    const validation = validateFoodEntry(newFood.name, newFood.calories, newFood.protein);
    if (!validation.valid) {
      setLocalError(validation.error || 'Invalid food entry');
      return;
    }
    setLocalError(null);
    await onSave({
      name: newFood.name,
      calories: parseInt(newFood.calories) || 0,
      protein: parseInt(newFood.protein) || 0
    });
    setNewFood({ name: '', calories: '', protein: '' });
  };

  const displayError = localError || externalError;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Add Custom Food</h2>
          <button
            onClick={onClose}
            aria-label="Close food modal"
            disabled={saving}
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            {displayError}
          </div>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Food Name"
            value={newFood.name}
            onChange={e => setNewFood({ ...newFood, name: e.target.value })}
            autoFocus
            className="w-full bg-slate-50 p-4 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-slate-900"
            disabled={saving}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Calories</label>
              <input
                type="number"
                placeholder="0"
                value={newFood.calories}
                onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                className="w-full bg-slate-50 p-4 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-slate-900 mt-1"
                disabled={saving}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Protein (g)</label>
              <input
                type="number"
                placeholder="0"
                value={newFood.protein}
                onChange={e => setNewFood({ ...newFood, protein: e.target.value })}
                className="w-full bg-slate-50 p-4 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-slate-900 mt-1"
                disabled={saving}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Adding...' : 'Add Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};



