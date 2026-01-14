import 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => (
  <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-700">{message}</p>
    </div>
  </div>
);



