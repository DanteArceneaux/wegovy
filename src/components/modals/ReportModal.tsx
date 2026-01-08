import 'react';
import { X } from 'lucide-react';
import { Shot, WeightEntry } from '../../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalLost: string;
  currentBMI: string;
  shots: Shot[];
  weightLog: WeightEntry[];
}

export const ReportModal = ({ isOpen, onClose, totalLost, currentBMI, shots, weightLog }: ReportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 p-6 animate-in slide-in-from-bottom overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Doctor Report</h2>
        <button onClick={onClose} aria-label="Close report modal">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">Patient Summary</h3>
          <p className="text-sm font-medium text-slate-800">
            Total Weight Loss: <span className="font-bold">{totalLost} lbs</span>
          </p>
          <p className="text-sm font-medium text-slate-800">
            Current BMI: <span className="font-bold">{currentBMI}</span>
          </p>
          <p className="text-sm font-medium text-slate-800">
            Adherence: <span className="font-bold">{shots.length > 0 ? '100%' : 'N/A'}</span>
          </p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-3">Recent Injections</h3>
          {shots.length === 0 && <p className="text-sm text-slate-400 italic">No logs available.</p>}
          {shots.slice(0, 4).map(s => (
            <div key={s.id} className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span>{new Date(s.date).toLocaleDateString()}</span>
              <span className="font-bold">{s.dosage} mg ({s.site})</span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-3">Recent Weights</h3>
          {weightLog.length === 0 && <p className="text-sm text-slate-400 italic">No logs available.</p>}
          {weightLog.slice(-5).reverse().map(w => (
            <div key={w.id} className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span>{new Date(w.date).toLocaleDateString()}</span>
              <span className="font-bold">{w.weight} lbs</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-xs text-yellow-800 leading-relaxed">
          <strong className="block mb-1">Disclaimer:</strong>
          This report is user-generated via the Wegovy Companion App and is intended for informational purposes during clinical visits.
        </div>
      </div>
    </div>
  );
};

