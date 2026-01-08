import 'react';
import { X } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempNotes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  saving: boolean;
}

export const NotesModal = ({ isOpen, onClose, tempNotes, onNotesChange, onSave, saving }: NotesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Daily Journal</h2>
          <button 
            onClick={onClose}
            aria-label="Close notes modal"
            disabled={saving}
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <textarea
          value={tempNotes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="How are you feeling today?"
          className="w-full h-40 bg-slate-50 p-4 rounded-xl resize-none text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={saving}
        />
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
};

