import 'react';
import { X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 max-w-md animate-in slide-in-from-top-5">
    <div className="flex-1">
      <p className="text-sm font-medium">{message}</p>
    </div>
    <button
      onClick={onClose}
      className="text-red-600 hover:text-red-800 transition-colors"
      aria-label="Close error message"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);



