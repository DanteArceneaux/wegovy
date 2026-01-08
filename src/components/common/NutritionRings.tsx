import { memo } from 'react';
import { motion } from 'framer-motion';

interface NutritionRingsProps {
    calories: number;
    calorieGoal: number;
    protein: number;
    proteinGoal: number;
}

export const NutritionRings = memo(({ calories, calorieGoal, protein, proteinGoal }: NutritionRingsProps) => {
    const calPercent = Math.min(1, calories / (calorieGoal || 1));
    const protPercent = Math.min(1, protein / (proteinGoal || 1));

    const strokeWidth = 12;
    const radius = 60;
    const innerRadius = 42;
    const center = 75;
    const circumference = 2 * Math.PI * radius;
    const innerCircumference = 2 * Math.PI * innerRadius;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 150 150">
                {/* Calorie Ring Background */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(79, 70, 229, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Calorie Ring Progress */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(79, 70, 229, 1)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - calPercent) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(79, 70, 229, 0.4))' }}
                />

                {/* Protein Ring Background */}
                <circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    stroke="rgba(16, 185, 129, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Protein Ring Progress */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    stroke="rgba(16, 185, 129, 1)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={innerCircumference}
                    initial={{ strokeDashoffset: innerCircumference }}
                    animate={{ strokeDashoffset: innerCircumference * (1 - protPercent) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-800 leading-none">{Math.round(calories)}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">kcal</span>
            </div>
        </div>
    );
});

NutritionRings.displayName = 'NutritionRings';
