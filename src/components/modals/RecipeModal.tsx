import { X, Clock, Zap, CheckCircle2, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '../../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onLogMeal: (recipe: Recipe) => void;
}

export const RecipeModal = ({ recipe, onClose, onLogMeal }: RecipeModalProps) => {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 bg-white z-[60] overflow-y-auto scrollbar-hide"
      >
        <div className="h-[45vh] relative">
          <img
            src={recipe.img}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-xl text-white rounded-2xl hover:bg-white/40 transition-all active:scale-95 border border-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5 font-black" />
          </button>

          <div className="absolute bottom-0 left-0 w-full p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {recipe.type}
                </span>
                <span className="bg-white/80 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-100">
                  {recipe.cost}
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{recipe.title}</h2>
            </motion.div>
          </div>
        </div>

        <div className="px-8 pb-32 space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-indigo-500 mb-2" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Prep Time</span>
              <span className="text-sm font-bold text-slate-800">{recipe.prep}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex flex-col items-center text-center">
              <Zap className="w-5 h-5 text-emerald-500 mb-2" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Calories</span>
              <span className="text-sm font-bold text-emerald-800">{recipe.calories} kcal</span>
            </div>
            <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100 flex flex-col items-center text-center">
              <ChefHat className="w-5 h-5 text-indigo-500 mb-2" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Protein</span>
              <span className="text-sm font-bold text-indigo-800">{recipe.protein}g</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Chef's Note</h3>
            <p className="text-lg font-medium text-slate-600 leading-relaxed italic">
              "{recipe.desc}"
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ingredients</h3>
              <div className="h-px flex-grow ml-4 bg-slate-100"></div>
            </div>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, i) => (
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={ing}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <span className="text-slate-700 font-bold group-hover:text-slate-900 transition-colors">{ing}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-sm z-[70]">
            <button
              onClick={() => onLogMeal(recipe)}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <Zap className="w-6 h-6 fill-current" /> Log this Meal
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};




