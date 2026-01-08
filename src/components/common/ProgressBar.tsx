import { memo } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass: string;
  label: string;
  unit: string;
}

export const ProgressBar = memo(({ current, max, colorClass, label, unit }: ProgressBarProps) => {
  const safeMax = max || 1;
  const percent = Math.min(100, Math.max(0, (current / safeMax) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1.5 px-0.5">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{label}</span>
        <span className="text-xs font-bold text-slate-700">
          {Math.round(current)}<span className="text-slate-400 font-medium text-[10px] lowercase"> {unit}</span>
          <span className="text-slate-300 font-normal mx-1">/</span>
          <span className="text-slate-400 font-normal text-[10px]">{safeMax}{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';


