import { Shot } from '../types';

export const calculateBMI = (weightLbs: number, heightFt: number, heightIn: number): string => {
  if (!weightLbs || !heightFt) return '0';
  const totalInches = (parseInt(String(heightFt)) * 12) + parseInt(String(heightIn));
  if (totalInches === 0) return '0';
  return ((weightLbs / (totalInches * totalInches)) * 703).toFixed(1);
};

export const getCycleDayForDate = (viewDateStr: string, shots: Shot[]): number => {
  if (!shots || shots.length === 0) return 0;
  const viewDate = new Date(viewDateStr + 'T00:00:00');

  // Filter shots before or on viewDate, then sort by date descending
  const validShots = shots
    .filter(s => {
      const shotDate = new Date(s.date + 'T00:00:00');
      return shotDate <= viewDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time).getTime();
      const dateB = new Date(b.date + 'T' + b.time).getTime();
      return dateB - dateA; // Descending order
    });

  if (validShots.length === 0) return 0;

  const lastShot = validShots[0]; // Most recent shot
  const lastShotDate = new Date(lastShot.date + 'T00:00:00');
  const diffTime = viewDate.getTime() - lastShotDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};



